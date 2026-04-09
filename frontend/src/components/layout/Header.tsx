"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-600">eRevive</span>
            <span className="text-sm font-medium text-gray-500">NW</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-emerald-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 space-y-2">
            <Link href="/how-it-works" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              How It Works
            </Link>
            <Link href="/about" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              About
            </Link>
            <Link href="/login" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              Sign In
            </Link>
            <Link href="/register" className="block px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
