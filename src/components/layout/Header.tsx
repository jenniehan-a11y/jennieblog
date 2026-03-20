'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" />
      <div className="relative max-w-[1440px] mx-auto px-8 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white/90 font-bold text-base tracking-[-0.02em] group-hover:text-white transition-colors">
            Jennie Trailer
          </span>
        </Link>
      </div>
    </header>
  );
}
