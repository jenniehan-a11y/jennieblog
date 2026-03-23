'use client';

import { useState } from 'react';
import Link from 'next/link';

const MENU_ITEMS = [
  { label: 'All', href: '/' },
  { label: 'Action', genre: '액션' },
  { label: 'Thriller', genre: '스릴러' },
  { label: 'Horror', genre: '공포' },
  { label: 'Sci-Fi', genre: 'SF' },
  { label: 'Romance', genre: '로맨스' },
  { label: 'Drama', genre: '드라마' },
  { label: 'Comedy', genre: '코미디' },
  { label: 'Crime', genre: '범죄' },
  { label: 'Fantasy', genre: '판타지' },
  { label: 'Mystery', genre: '미스터리' },
  { label: 'Korea', region: 'domestic' },
  { label: 'International', region: 'international' },
];

interface HeaderProps {
  onFilter?: (filter: { genre?: string; region?: string } | null) => void;
}

export default function Header({ onFilter }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (item: typeof MENU_ITEMS[0]) => {
    setMenuOpen(false);
    if (onFilter) {
      if (item.href) onFilter(null);
      else if (item.genre) onFilter({ genre: item.genre });
      else if (item.region) onFilter({ region: item.region });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="text-black font-black text-lg tracking-[-0.04em] uppercase"
            onClick={() => { setMenuOpen(false); onFilter?.(null); }}>
            Jennie Trailer
          </Link>
        </div>
      </header>

      {/* FILTER 바 */}
      <div className="sticky top-14 z-40 bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full flex items-center justify-between py-4 text-sm font-bold uppercase tracking-[0.1em]"
          >
            <span>Filter</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-[112px]" onClick={() => setMenuOpen(false)}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 py-4" onClick={e => e.stopPropagation()}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className="block w-full text-left py-4 border-b border-black/5 text-black text-2xl font-semibold tracking-[-0.02em] hover:text-black/50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
