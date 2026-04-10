"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/use-auth";
import { api, ApiError } from "@/lib/api-client";
import { PICKUP_TIME_WINDOWS, SEATTLE_ZIP_PREFIXES } from "@/lib/constants";

export default function SchedulePickupPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [instructions, setInstructions] = useState("");

  const isValidZip = zipCode.length >= 3 && SEATTLE_ZIP_PREFIXES.some((p) => zipCode.startsWith(p));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) { router.push("/login"); return; }

    setError(null);
    setSubmitting(true);

    try {
      await api.post(
        "/pickups",
        {
          scheduled_date: date,
          time_window: timeWindow,
          address_line1: address,
          address_line2: address2 || null,
          zip_code: zipCode,
          special_instructions: instructions || null,
        },
        { token },
      );
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to schedule pickup");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Schedule a Pickup</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Window</label>
              <select
                required
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none"
              >
                <option value="">Select a time...</option>
                {PICKUP_TIME_WINDOWS.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Pine Street"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apt / Suite (optional)</label>
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="98101"
                maxLength={5}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none ${
                  zipCode.length >= 3 && !isValidZip
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-green-600 focus:ring-green-700/20"
                } focus:ring-2`}
              />
              {zipCode.length >= 3 && !isValidZip && (
                <p className="mt-1 text-sm text-red-600">
                  We only serve the Seattle metro area (ZIP codes starting with 980 or 981)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (optional)</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Gate code, where to find items, etc."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-700/20 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isValidZip || !date || !timeWindow || !address}
              className="w-full rounded-lg bg-[#2d5016] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a3a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Scheduling..." : "Schedule Free Pickup"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
