"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ALL_ITEM_TYPES, CONDITION_OPTIONS, ITEM_GROUPS } from "@/lib/constants";
import type { IdentificationResult, ItemResponse } from "@/types/api";

const API = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

type Step = "choose" | "upload" | "identifying" | "review" | "contact" | "receipt";

export default function PublicDonatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  // Receipt data
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const startDonation = async (): Promise<string> => {
    if (itemId) return itemId;
    const resp = await fetch(`${API}/donate/start`, { method: "POST" });
    if (!resp.ok) throw new Error("Failed to start donation");
    const item: ItemResponse = await resp.json();
    setItemId(item.id);
    return item.id;
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }, []);

  const handleDescribeManually = async () => {
    setError(null);
    try {
      await startDonation();
      setStep("review");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUploadAndIdentify = async () => {
    if (!file) return;
    setError(null);
    setStep("identifying");
    try {
      const id = await startDonation();
      const formData = new FormData();
      formData.append("file", file);
      const uploadResp = await fetch(`${API}/donate/${id}/upload`, { method: "POST", body: formData });
      if (!uploadResp.ok) throw new Error("Upload failed");

      const idResp = await fetch(`${API}/donate/${id}/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!idResp.ok) {
        setStep("review");
        return;
      }
      const result: IdentificationResult = await idResp.json();
      setAiResult(result);
      setDescription(result.description);
      setCondition(result.condition || "");
      const match = ALL_ITEM_TYPES.find((i) => i.toLowerCase().includes((result.category || "").toLowerCase()));
      if (match) setSelectedItems([match]);
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
          title: selectedItems.length > 0 ? selectedItems.join(", ") : "Donated Item",
          description: description || "No description provided",
          category: selectedItems.length > 0 ? selectedItems[0] : null,
          condition: condition || null,
          donor_name: donorName || null,
          donor_email: donorEmail || null,
          donor_phone: donorPhone || null,
        }),
      });
      if (!resp.ok) throw new Error("Submission failed");
      const data: ItemResponse = await resp.json();
      setReceiptNumber(data.id.split("-")[0].toUpperCase());
      setReceiptDate(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
      setStep("receipt");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const reset = () => {
    setStep("choose");
    setFile(null);
    setPreview(null);
    setItemId(null);
    setAiResult(null);
    setError(null);
    setSelectedItems([]);
    setDescription("");
    setCondition("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setReceiptNumber("");
    setReceiptDate("");
  };

  const progressSteps = ["Start", "Details", "Contact", "Receipt"];
  const progressIdx = (() => {
    switch (step) {
      case "choose": case "upload": case "identifying": return 0;
      case "review": return 1;
      case "contact": return 2;
      case "receipt": return 3;
    }
  })();

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Donate Electronics</h1>
          <p className="text-sm text-gray-600 mb-8">
            Free e-waste recycling for the Seattle area. No account needed. Photo optional.
          </p>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {progressSteps.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full ${progressIdx >= i ? "bg-green-500" : "bg-gray-200"}`} />
                <p className={`text-xs mt-1 ${progressIdx >= i ? "text-[#2d5016] font-medium" : "text-gray-400"}`}>{label}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
          )}

          {/* Step 1: Choose path */}
          {step === "choose" && (
            <div className="space-y-4">
              <button onClick={() => setStep("upload")} className="w-full bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-green-600 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#2d5016] group-hover:bg-emerald-200 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upload a photo</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Our AI will identify the item and fill in the details for you</p>
                  </div>
                </div>
              </button>
              <button onClick={handleDescribeManually} className="w-full bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-green-600 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-[#2d5016] transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Describe it</h3>
                    <p className="text-sm text-gray-500 mt-0.5">No photo needed — just tell us what you have</p>
                  </div>
                </div>
              </button>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Just bring it</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Drop off during business hours, no appointment needed</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-900">123 Paper St, Seattle, WA 98101</p>
                  <p className="text-sm text-gray-600 mt-1">Mon - Fri: 9am - 5pm &middot; Sat: 10am - 2pm</p>
                  <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2 inline-block">Note: Some items may not be accepted. Hazardous materials, CRT monitors, and items containing refrigerant require special handling.</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload photo */}
          {step === "upload" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <label htmlFor="photo-upload" className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-12 block hover:border-green-600 transition-colors text-center">
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
              <div className="mt-6 flex gap-3">
                {file ? (
                  <button onClick={handleUploadAndIdentify} className="flex-1 rounded-lg bg-[#2d5016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a3a0a] transition-colors">Upload & Identify with AI</button>
                ) : (<div className="flex-1" />)}
                <button onClick={() => setStep("choose")} className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              </div>
            </div>
          )}

          {/* Identifying spinner */}
          {step === "identifying" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="animate-spin mx-auto h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full" />
              <p className="mt-4 text-sm text-gray-600">AI is analyzing your image...</p>
            </div>
          )}

          {/* Step 2: Review / describe */}
          {step === "review" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
              {preview && <img src={preview} alt="Item" className="mx-auto max-h-48 rounded-lg object-contain" />}
              {aiResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900 text-center">
                  AI identified with {Math.round(aiResult.confidence * 100)}% confidence
                </div>
              )}
              {!preview && !aiResult && (
                <p className="text-sm text-gray-500 text-center">Select everything you&apos;d like to donate</p>
              )}

              {/* Grouped multi-select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">What are you donating? <span className="text-red-500">*</span></label>
                <div className="space-y-4">
                  {ITEM_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => {
                          const selected = selectedItems.includes(item);
                          return (
                            <button
                              key={`${group.label}-${item}`}
                              type="button"
                              onClick={() => toggleItem(item)}
                              className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
                                selected
                                  ? "bg-[#2d5016] text-white border-emerald-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-[#2d5016]"
                              }`}
                            >
                              {selected && <span className="mr-1">&#10003;</span>}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedItems.length > 0 && (
                  <p className="mt-3 text-xs text-[#2d5016] font-medium">{selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brand, model, age, quantity, any issues, etc." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none bg-white">
                  {CONDITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleNext} disabled={selectedItems.length === 0} className="w-full rounded-lg bg-[#2d5016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a3a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next: Contact Info
              </button>
            </div>
          )}

          {/* Step 3: Contact (optional) */}
          {step === "contact" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-5">
              <p className="text-sm text-gray-600">Optional — leave blank to donate anonymously.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Jane Doe" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="(206) 555-0100" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none" />
              </div>
              <button onClick={handleSubmit} className="w-full rounded-lg bg-[#2d5016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a3a0a] transition-colors">
                Submit Donation
              </button>
              <button onClick={handleSubmit} className="w-full text-sm text-gray-500 hover:text-gray-700">
                Skip — donate anonymously
              </button>
            </div>
          )}

          {/* Step 4: Receipt */}
          {step === "receipt" && (
            <div ref={receiptRef}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print:shadow-none print:border-0">
                {/* Receipt header */}
                <div className="bg-[#2d5016] px-8 py-6 text-white print:bg-white print:text-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">eRevive NW</h2>
                      <p className="text-sm text-green-200 print:text-gray-600">E-Waste Recycling — Seattle, WA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-200 print:text-gray-600">Donation Receipt</p>
                      <p className="text-lg font-bold">#{receiptNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-5">
                  {/* Date */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">{receiptDate}</span>
                  </div>

                  {/* Donor info */}
                  {(donorName || donorEmail || donorPhone) && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Donor</p>
                      {donorName && <p className="text-sm text-gray-900 font-medium">{donorName}</p>}
                      {donorEmail && <p className="text-sm text-gray-600">{donorEmail}</p>}
                      {donorPhone && <p className="text-sm text-gray-600">{donorPhone}</p>}
                    </div>
                  )}

                  {/* Items */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items Donated</p>
                    <div className="space-y-1.5">
                      {selectedItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <span className="text-[#2d5016]">&#10003;</span>
                          <span className="text-gray-900">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {description && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</p>
                      <p className="text-sm text-gray-700">{description}</p>
                    </div>
                  )}

                  {/* Condition */}
                  {condition && (
                    <div className="flex justify-between text-sm border-t border-gray-100 pt-4">
                      <span className="text-gray-500">Condition</span>
                      <span className="font-medium text-gray-900 capitalize">{condition}</span>
                    </div>
                  )}

                  {/* Footer note */}
                  <div className="border-t border-gray-100 pt-4 text-center">
                    <p className="text-xs text-gray-400">
                      Thank you for recycling responsibly with eRevive NW.
                      This receipt confirms your donation submission. Items are subject to review.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      eRevive NW &middot; Seattle, WA &middot; erevivenw.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions (hidden in print) */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center print:hidden">
                <button onClick={handlePrintReceipt} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Print Receipt
                </button>
                <button onClick={reset} className="rounded-lg bg-[#2d5016] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3a0a] transition-colors">
                  Donate Another Item
                </button>
                <button onClick={() => router.push("/")} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
