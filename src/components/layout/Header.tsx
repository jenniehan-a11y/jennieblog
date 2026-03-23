'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center">
        <Link href="/" className="text-white font-bold text-lg tracking-[-0.03em]">
          Jennie Trailer
        </Link>
      </div>
    </header>
  );
}
