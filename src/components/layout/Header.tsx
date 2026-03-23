'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="text-white font-black text-xl tracking-[-0.04em] uppercase">
          Jennie Trailer
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#now" className="text-white/40 hover:text-white text-xs font-semibold uppercase tracking-[0.1em] transition-colors">Now</a>
          <a href="#coming" className="text-white/40 hover:text-white text-xs font-semibold uppercase tracking-[0.1em] transition-colors">Coming Soon</a>
          <a href="#genres" className="text-white/40 hover:text-white text-xs font-semibold uppercase tracking-[0.1em] transition-colors">Genres</a>
        </nav>
      </div>
    </header>
  );
}
