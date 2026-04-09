"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { IdentificationResult, ItemResponse } from "@/types/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Step = "upload" | "identifying" | "review" | "contact" | "done";

export default function PublicDonatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }, []);

  const handleUploadAndIdentify = async () => {
    if (!file) return;
    setError(null);
    setStep("identifying");

    try {
      // 1. Start anonymous donation
      const startResp = await fetch(`${API}/donate/start`, { method: "POST" });
      if (!startResp.ok) throw new Error("Failed to start donation");
      const item: ItemResponse = await startResp.json();
      setItemId(item.id);

      // 2. Upload image
      const formData = new FormData();
      formData.append("file", file);
      const uploadResp = await fetch(`${API}/donate/${item.id}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!uploadResp.ok) throw new Error("Upload failed");

      // 3. AI identify
      const idResp = await fetch(`${API}/donate/${item.id}/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!idResp.ok) {
        // AI might not be available — let user fill in manually
        setTitle("");
        setDescription("");
        setStep("review");
        return;
      }

      const result: IdentificationResult = await idResp.json();
      setAiResult(result);
      setTitle(result.title);
      setDescription(result.description);
      setCategory(result.category || "");
      setCondition(result.condition || "");
      setStep("review");
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
      setStep("upload");
    }
  };

  const handleNext = () => setStep("contact");

  const handleSubmit = async () => {
    if (!itemId) return;
    try {
      const resp = await fetch(`${API}/donate/${itemId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Donated Item",
          description: description || "No description provided",
          category: category || null,
          condition: condition || null,
          donor_name: donorName || null,
          donor_email: donorEmail || null,
          donor_phone: donorPhone || null,
        }),
      });
      if (!resp.ok) throw new Error("Submission failed");
      setStep("done");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Donate Electronics</h1>
          <p className="text-sm text-gray-600 mb-8">No account needed. Just snap a photo and submit.</p>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {["Photo", "Review", "Contact", "Done"].map((label, i) => {
              const stepMap: Step[] = ["upload", "review", "contact", "done"];
              const currentIdx = stepMap.indexOf(step === "identifying" ? "upload" : step);
              const isActive = currentIdx >= i;
              return (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-200"}`} />
                  <p className={`text-xs mt-1 ${isActive ? "text-emerald-700 font-medium" : "text-gray-400"}`}>{label}</p>
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
              <label
                htmlFor="photo-upload"
                className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-12 block hover:border-emerald-400 transition-colors text-center"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg object-contain" />
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    <p className="mt-4 text-sm text-gray-600">Click to upload a photo of your electronic item</p>
                    <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP up to 10MB</p>
                  </>
                )}
                <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFileSelect} />
              </label>
              {file && (
                <button onClick={handleUploadAndIdentify} className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
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
              {preview && <img src={preview} alt="Item" className="mx-auto max-h-48 rounded-lg object-contain" />}
              {aiResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 text-center">
                  AI identified with {Math.round(aiResult.confidence * 100)}% confidence
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What is it?</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Dell Laptop" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Condition, any issues, etc." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none">
                    <option value="">Unknown</option>
                    <option value="working">Working</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
              </div>
              <button onClick={handleNext} className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                Next: Contact Info
              </button>
            </div>
          )}

          {/* Step 4: Contact (optional) */}
          {step === "contact" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-5">
              <p className="text-sm text-gray-600">Optional — leave blank to donate anonymously.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Jane Doe" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="(206) 555-0100" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" />
              </div>
              <button onClick={handleSubmit} className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                Submit Donation
              </button>
              <button onClick={handleSubmit} className="w-full text-sm text-gray-500 hover:text-gray-700">
                Skip — donate anonymously
              </button>
            </div>
          )}

          {/* Step 5: Done */}
          {step === "done" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                ✓
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">Thank you!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your donation has been submitted. We&apos;ll review it shortly.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button onClick={() => { setStep("upload"); setFile(null); setPreview(null); setItemId(null); setAiResult(null); }} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                  Donate Another Item
                </button>
                <button onClick={() => router.push("/")} className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
