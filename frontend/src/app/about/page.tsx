import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us | eRevive NW | E-Waste Recycling Seattle",
  description:
    "eRevive NW provides free, responsible e-waste recycling for the Seattle metro area. Learn about our mission to keep electronics out of landfills.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1a3a0a] to-[#2d5016] text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold">About eRevive NW</h1>
            <p className="mt-4 text-lg text-green-200 max-w-2xl">
              Keeping electronics out of landfills and giving them a second life in the Pacific Northwest.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Every year, millions of pounds of electronic waste end up in landfills, leaching toxic materials into the soil and water. eRevive NW exists to change that in the Seattle area.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We make it as easy as possible to recycle your old electronics. Snap a photo, let our AI identify it, and schedule a free pickup — or just drop it off. We handle the rest: sorting, refurbishing what we can, and ensuring proper recycling for everything else.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Why It Matters</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-[#2d5016]">50M+</p>
                <p className="mt-2 text-sm text-gray-600">Metric tons of e-waste generated globally each year</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#2d5016]">17%</p>
                <p className="mt-2 text-sm text-gray-600">Of global e-waste is properly recycled</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#2d5016]">70%</p>
                <p className="mt-2 text-sm text-gray-600">Of toxic waste in landfills comes from electronics</p>
              </div>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Refurbish & Donate",
                  text: "Working devices are cleaned, tested, and donated to local schools, nonprofits, and community organizations.",
                },
                {
                  title: "Harvest & Reuse",
                  text: "Usable components like RAM, drives, and GPUs are pulled and made available for reuse, extending their life.",
                },
                {
                  title: "Certified Recycling",
                  text: "Materials that can't be reused are processed by R2 and e-Stewards certified recycling partners.",
                },
                {
                  title: "Data Security",
                  text: "We offer data destruction services for hard drives and storage devices. Your data never leaves our facility intact.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service area */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Service Area</h2>
            <p className="mt-4 text-gray-600">
              We currently serve the Seattle metro area, covering ZIP codes starting with 980 and 981. This includes Seattle, Bellevue, Redmond, Kirkland, Renton, Kent, Federal Way, Tacoma, and surrounding communities.
            </p>
            <div className="mt-6 rounded-lg bg-white border border-gray-200 p-6 inline-block">
              <p className="text-sm font-medium text-gray-900">Drop-off Location</p>
              <p className="text-sm text-gray-600 mt-1">123 Paper St, Seattle, WA 98101</p>
              <p className="text-sm text-gray-600">Mon-Fri 9am-5pm &middot; Sat 10am-2pm</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="mx-auto max-w-xl px-4">
            <h2 className="text-2xl font-bold text-gray-900">Start recycling today</h2>
            <p className="mt-3 text-gray-600">
              Every device you recycle keeps toxic materials out of our environment.
            </p>
            <Link
              href="/donate"
              className="mt-6 inline-flex rounded-lg bg-[#2d5016] px-8 py-3 text-sm font-semibold text-white hover:bg-[#1a3a0a] transition-colors"
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
