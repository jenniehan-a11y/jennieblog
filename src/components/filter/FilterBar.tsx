'use client';

import { useState } from 'react';

const MENU_ITEMS = [
  { label: 'All', value: null },
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
  { label: 'Korea', value: { region: 'domestic' } },
  { label: 'International', value: { region: 'international' } },
];

interface FilterBarProps {
  onFilter: (filter: { genre?: string; region?: string } | null) => void;
  activeLabel: string | null;
}

export default function FilterBar({ onFilter, activeLabel }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item: typeof MENU_ITEMS[0]) => {
    onFilter(item.value);
    setOpen(false);
  };

  return (
    <>
      {/* FILTER 바 — 항상 고정 */}
      <div className="sticky top-14 z-40">
        <div className="bg-black">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between py-4"
            >
              <span className="text-white text-[13px] font-bold uppercase tracking-[0.12em]">
                {activeLabel ? `Filter: ${activeLabel}` : 'Filter'}
              </span>
              <svg
                className={`w-[18px] h-[18px] text-white transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 드롭다운 */}
      {open && (
        <>
          {/* 배경 클릭으로 닫기 */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="relative z-35 bg-white border-b border-black/10 shadow-lg">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSelect(item)}
                  className={`block w-full text-left py-3.5 border-b border-black/5 last:border-0 text-xl font-semibold tracking-[-0.02em] transition-colors ${
                    (activeLabel === item.label || (!activeLabel && item.label === 'All'))
                      ? 'text-black'
                      : 'text-black/30 hover:text-black'
                  }`}
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
