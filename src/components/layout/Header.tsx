'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-center">
        <Link href="/" className="text-black font-black text-lg tracking-[-0.04em] uppercase">
          Jennie Trailer
        </Link>
      </div>
    </header>
  );
}
