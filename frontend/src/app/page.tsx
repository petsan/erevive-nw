import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Give your electronics a{" "}
                <span className="text-emerald-200">second life</span>
              </h1>
              <p className="mt-6 text-lg text-emerald-100 leading-relaxed">
                Snap a photo, get an instant AI description, and schedule a free
                pickup. Responsible e-waste recycling made simple for the Seattle
                area.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/donate"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors"
                >
                  Donate Now
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-lg border border-emerald-300 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500/20 transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Three simple steps
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                From photo to pickup in minutes
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <StepCard
                number="1"
                title="Snap a Photo"
                description="Upload a picture of your electronics. Our AI instantly identifies the item and writes a description for you."
              />
              <StepCard
                number="2"
                title="Review & Submit"
                description="Check the AI-generated description, make any edits, and submit your donation."
              />
              <StepCard
                number="3"
                title="Schedule Pickup"
                description="Choose a convenient time and we'll pick it up from your doorstep. Free for all Seattle area residents."
              />
            </div>
          </div>
        </section>

        {/* Service Area Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Serving the Seattle Metro Area
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We currently serve Seattle and surrounding communities. Enter your
              ZIP code when scheduling to confirm we cover your area.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
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

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl bg-gray-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
        {number}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
