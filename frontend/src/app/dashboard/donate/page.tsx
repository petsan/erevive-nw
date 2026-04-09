"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/use-auth";
import { api, ApiError } from "@/lib/api-client";
import type { IdentificationResult, ItemResponse } from "@/types/api";

type Step = "upload" | "identifying" | "review" | "submitted";

export default function DonatePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [aiResult, setAiResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }, []);

  const handleUploadAndIdentify = async () => {
    if (!file) return;
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setError(null);
    setStep("identifying");

    try {
      // 1. Create item
      const newItem = await api.post<ItemResponse>(
        "/items",
        { title: "Pending identification", description: "Uploading..." },
        { token },
      );
      setItem(newItem);

      // 2. Upload image
      const formData = new FormData();
      formData.append("file", file);

      const uploadResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/items/${newItem.id}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (!uploadResp.ok) throw new Error("Upload failed");

      // 3. Identify
      const identifyResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/items/${newItem.id}/identify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!identifyResp.ok) {
        const errBody = await identifyResp.json().catch(() => ({}));
        throw new Error(errBody.detail || "Identification failed");
      }

      const result: IdentificationResult = await identifyResp.json();
      setAiResult(result);
      setTitle(result.title);
      setDescription(result.description);
      setCategory(result.category || "");
      setCondition(result.condition || "");
      setStep("review");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : (err as Error).message || "Something went wrong");
      setStep("upload");
    }
  };

  const handleSubmit = async () => {
    setStep("submitted");
    router.push("/dashboard");
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Donate an Item</h1>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {["Upload", "Identify", "Review"].map((label, i) => {
              const steps: Step[] = ["upload", "identifying", "review"];
              const isActive = steps.indexOf(step) >= i || step === "submitted";
              return (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-200"}`} />
                  <p className={`text-xs mt-1 ${isActive ? "text-emerald-700 font-medium" : "text-gray-400"}`}>
                    {label}
                  </p>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
          )}

          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center">
                <label
                  htmlFor="photo-upload"
                  className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-12 block hover:border-emerald-400 transition-colors"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg object-contain" />
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                        />
                      </svg>
                      <p className="mt-4 text-sm text-gray-600">
                        Click to upload a photo of your electronic item
                      </p>
                      <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP up to 10MB</p>
                    </>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {file && (
                <button
                  onClick={handleUploadAndIdentify}
                  className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  Upload & Identify with AI
                </button>
              )}
            </div>
          )}

          {/* Step 2: Identifying */}
          {step === "identifying" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin mx-auto h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
              <p className="mt-4 text-sm text-gray-600">AI is analyzing your image...</p>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-5">
              {preview && (
                <img src={preview} alt="Uploaded item" className="mx-auto max-h-48 rounded-lg object-contain" />
              )}

              {aiResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
                  AI identified with {Math.round(aiResult.confidence * 100)}% confidence
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value="">Unknown</option>
                    <option value="working">Working</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                Submit Donation
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
