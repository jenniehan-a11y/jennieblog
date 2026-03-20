'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl">🎬</span>
          <span className="text-white font-bold text-[17px] tracking-tight group-hover:opacity-80 transition-opacity">
            Jennie Trailer
          </span>
        </Link>
      </div>
    </header>
  );
}
