"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import type { ItemResponse } from "@/types/api";

export default function DashboardPage() {
  const { user, loading, getToken } = useAuth();
  const [items, setItems] = useState<ItemResponse[]>([]);

  useEffect(() => {
    if (user) {
      const token = getToken();
      if (token) {
        api.get<ItemResponse[]>("/items", { token }).then(setItems).catch(() => {});
      }
    }
  }, [user, getToken]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back{user ? `, ${user.full_name}` : ""}
              </p>
            </div>
            <Link
              href="/dashboard/donate"
              className="rounded-lg bg-[#2d5016] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3a0a] transition-colors"
            >
              Donate an Item
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
              <p className="mt-2 text-sm text-gray-600">
                Start by donating your first electronic item.
              </p>
              <Link
                href="/dashboard/donate"
                className="mt-6 inline-flex rounded-lg bg-[#2d5016] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3a0a] transition-colors"
              >
                Upload a Photo
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.ai_confidence && (
                      <span className="text-xs text-gray-500">
                        {Math.round(item.ai_confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  {item.category && (
                    <p className="mt-2 text-xs text-gray-500">{item.category}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
