import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto text-green-200/70" style={{ backgroundColor: "#0f1f0a" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold text-green-400">eRevive</span>
            <span className="text-sm text-green-600 ml-1">NW</span>
            <p className="mt-3 text-sm">
              Responsible e-waste recycling for Seattle and surrounding areas.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/donate" className="text-sm hover:text-white transition-colors">Donate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Service Area</h3>
            <p className="mt-3 text-sm">
              Seattle, WA and the Puget Sound region (ZIP 980xx, 981xx)
            </p>
            <p className="mt-2 text-sm">Free pickup service available</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-900/50 text-center text-xs text-green-700">
          &copy; {new Date().getFullYear()} eRevive NW. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
