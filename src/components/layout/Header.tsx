'use client';

import { useState } from 'react';
import Link from 'next/link';

const MENU_ITEMS = [
  { label: 'All Trailers', value: null },
  { label: 'Action', value: { genre: '액션' } },
  { label: 'Thriller', value: { genre: '스릴러' } },
  { label: 'Horror', value: { genre: '공포' } },
  { label: 'Sci-Fi', value: { genre: 'SF' } },
  { label: 'Romance', value: { genre: '로맨스' } },
  { label: 'Drama', value: { genre: '드라마' } },
  { label: 'Comedy', value: { genre: '코미디' } },
  { label: 'Crime', value: { genre: '범죄' } },
  { label: 'Fantasy', value: { genre: '판타지' } },
  { label: 'Mystery', value: { genre: '미스터리' } },
];

interface HeaderProps {
  onFilter?: (filter: { genre?: string; region?: string } | null) => void;
}

export default function Header({ onFilter }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (item: typeof MENU_ITEMS[0]) => {
    onFilter?.(item.value);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-center gap-3">
          {/* 햄버거 메뉴 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-[5px] group"
            aria-label="메뉴"
          >
            <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>

          {/* 로고 */}
          <Link href="/" className="text-black font-black text-lg tracking-[-0.04em] uppercase"
            onClick={() => { setMenuOpen(false); onFilter?.(null); }}>
            Jennie Trailer
          </Link>
        </div>
      </header>

      {/* 메뉴 드롭다운 */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-black/10 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSelect(item)}
                  className="block w-full text-left py-4 border-b border-black/5 last:border-0 text-2xl font-semibold tracking-[-0.02em] text-black hover:text-black/40 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
