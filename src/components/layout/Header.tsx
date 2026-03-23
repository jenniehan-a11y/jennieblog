'use client';

import Link from 'next/link';

interface HeaderProps {
  onFilter?: (filter: { genre?: string; region?: string } | null) => void;
}

export default function Header({ onFilter }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-center">
        <Link href="/" className="text-black font-black text-lg tracking-[-0.04em] uppercase"
          onClick={() => onFilter?.(null)}>
          Jennie Trailer
        </Link>
      </div>
    </header>
  );
}
