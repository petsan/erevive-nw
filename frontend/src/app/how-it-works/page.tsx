import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "How It Works | Free E-Waste Recycling | eRevive NW",
  description:
    "Learn how eRevive NW makes e-waste recycling easy in Seattle. Upload a photo or describe your item, schedule a free pickup, and we handle the rest.",
};

const steps = [
  {
    number: "1",
    title: "Tell us what you have",
    description:
      "Upload a photo and our AI will instantly identify your device, or just select from our list of common electronics. No account required.",
    details: [
      "Laptops, desktops, servers, phones, tablets",
      "Monitors, TVs, printers, networking gear",
      "Components: GPUs, RAM, hard drives, motherboards",
      "Cables, chargers, batteries, and more",
    ],
  },
  {
    number: "2",
    title: "Review and submit",
    description:
      "Check the details, add any notes about condition or quantity, and optionally leave your contact info. Or donate completely anonymously.",
    details: [
      "Edit AI-generated descriptions if needed",
      "Select item condition: working, damaged, or untested",
      "Contact info is optional — donate anonymously",
      "Get a printable donation receipt",
    ],
  },
  {
    number: "3",
    title: "We pick it up (or you drop off)",
    description:
      "Schedule a free pickup at your door anywhere in the Seattle metro area, or drop items off at our location during business hours.",
    details: [
      "Free pickup for Seattle ZIP codes (980xx, 981xx)",
      "Choose morning, afternoon, or evening windows",
      "Or drop off at 123 Paper St, Seattle, WA 98101",
      "Mon-Fri 9am-5pm, Sat 10am-2pm",
    ],
  },
  {
    number: "4",
    title: "Responsible recycling",
    description:
      "We sort, refurbish what we can, and ensure everything else is recycled through certified e-waste processors. Nothing goes to landfill.",
    details: [
      "Working devices are refurbished and donated",
      "Components are harvested and reused",
      "Remaining materials recycled by certified partners",
      "Data destruction available on request",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold">How It Works</h1>
            <p className="mt-4 text-lg text-emerald-100 max-w-2xl">
              Recycling your old electronics is simple, free, and takes just a few minutes.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
                  <p className="mt-2 text-gray-600 leading-relaxed">{step.description}</p>
                  <ul className="mt-4 space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500 mt-0.5">&#10003;</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What we accept */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">What We Accept</h2>
            <p className="mt-4 text-center text-gray-600">
              We accept most consumer and business electronics. If you&apos;re not sure, just submit it and we&apos;ll let you know.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Laptops", "Desktops", "Servers", "Monitors", "TVs", "Cell Phones",
                "Tablets", "Printers", "Keyboards", "Mice", "Cables", "Routers",
                "Hard Drives", "RAM", "GPUs", "Motherboards", "Batteries / UPS",
                "Gaming Consoles",
              ].map((item) => (
                <div key={item} className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 text-center">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <strong>Not accepted:</strong> Household appliances (fridges, washers), smoke detectors, items containing mercury or refrigerant. Contact us if unsure.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="mx-auto max-w-xl px-4">
            <h2 className="text-2xl font-bold text-gray-900">Ready to recycle?</h2>
            <p className="mt-3 text-gray-600">It takes less than 2 minutes. No account needed.</p>
            <Link
              href="/donate"
              className="mt-6 inline-flex rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
