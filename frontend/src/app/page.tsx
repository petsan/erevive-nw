import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero — Seattle forest gradient with mountain silhouette */}
        <section className="seattle-backdrop seattle-rain relative text-white" style={{ background: "linear-gradient(135deg, #1a3a0a 0%, #2d5016 40%, #1a5c2e 70%, #0f4a3a 100%)" }}>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wider uppercase text-green-300/80 mb-4">Seattle&apos;s E-Waste Recycling Service</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Give your electronics a{" "}
                <span className="text-green-300">second life</span>
              </h1>
              <p className="mt-6 text-lg text-green-100/90 leading-relaxed">
                Snap a photo, get an instant AI description, and schedule a free
                pickup. Responsible e-waste recycling made simple for the Pacific Northwest.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/donate"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-green-900 shadow-sm hover:bg-green-50 transition-colors"
                >
                  Donate Now
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-lg border border-green-400/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Three steps */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Three simple steps</h2>
              <p className="mt-4 text-lg text-gray-600">From photo to pickup in minutes</p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <StepCard number="1" title="Snap a Photo" description="Upload a picture of your electronics. Our AI instantly identifies the item and writes a description for you." />
              <StepCard number="2" title="Review & Submit" description="Check the AI-generated description, make any edits, and submit your donation." />
              <StepCard number="3" title="Schedule Pickup" description="Choose a convenient time and we'll pick it up from your doorstep. Free for all Seattle area residents." />
            </div>
          </div>
        </section>

        {/* Service area — mist background */}
        <section className="py-20" style={{ backgroundColor: "#e8efe8" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Serving the Seattle Metro Area</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From Tacoma to Everett, Bellevue to Bainbridge. We serve the entire Puget Sound region.
            </p>
            <div className="mt-8">
              <Link
                href="/donate"
                className="inline-flex rounded-lg px-8 py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#2d5016" }}
              >
                Check Your Area
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative rounded-2xl p-8 text-center" style={{ backgroundColor: "#f0f5f0" }}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg text-white" style={{ backgroundColor: "#2d5016" }}>
        {number}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
