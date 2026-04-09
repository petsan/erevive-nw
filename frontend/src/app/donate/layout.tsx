import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate Electronics | Free E-Waste Recycling in Seattle | eRevive NW",
  description:
    "Donate your old electronics for free recycling in Seattle, WA. Laptops, phones, servers, monitors, and more. Upload a photo for AI identification or describe your items. Free pickup available. No account needed.",
  keywords: [
    "e-waste recycling Seattle",
    "donate electronics Seattle",
    "free electronics recycling",
    "computer recycling Seattle WA",
    "laptop recycling near me",
    "electronic waste disposal Seattle",
    "recycle old phone Seattle",
    "server recycling Seattle",
    "monitor recycling",
    "e-waste pickup Seattle",
    "free e-waste drop off Seattle",
    "responsible electronics recycling",
    "donate old computer",
    "IT equipment recycling Seattle",
  ],
  openGraph: {
    title: "Donate Electronics for Free Recycling | eRevive NW",
    description:
      "Free e-waste recycling in the Seattle area. Donate laptops, phones, servers, monitors, and more. AI-powered identification. Free pickup or drop-off.",
    type: "website",
    locale: "en_US",
    siteName: "eRevive NW",
    url: "https://erevivenw.com/donate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donate Electronics for Free Recycling | eRevive NW",
    description:
      "Free e-waste recycling in Seattle. Laptops, phones, servers, monitors. No account needed. Free pickup.",
  },
  alternates: {
    canonical: "https://erevivenw.com/donate",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "eRevive NW",
  description:
    "Free e-waste recycling service in the Seattle metropolitan area. Donate laptops, desktops, servers, phones, monitors, and other electronics. AI-powered item identification. Free pickup or drop-off.",
  url: "https://erevivenw.com",
  areaServed: {
    "@type": "City",
    name: "Seattle",
    containedInPlace: {
      "@type": "State",
      name: "Washington",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seattle",
    addressRegion: "WA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.6062,
    longitude: -122.3321,
  },
  serviceType: ["E-Waste Recycling", "Electronics Recycling", "Computer Recycling", "IT Asset Disposal"],
  priceRange: "Free",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Accepted Electronics",
    itemListElement: [
      "Laptops",
      "Desktop Computers",
      "Servers",
      "Monitors",
      "Cell Phones",
      "Tablets",
      "Printers",
      "TVs",
      "Networking Equipment",
      "Hard Drives",
      "RAM",
      "GPUs",
      "Motherboards",
      "Cables",
      "Batteries",
      "Gaming Consoles",
    ].map((item, i) => ({
      "@type": "Offer",
      position: i + 1,
      itemOffered: { "@type": "Service", name: `${item} Recycling` },
      price: "0",
      priceCurrency: "USD",
    })),
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
