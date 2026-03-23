'use client';

import { useState, useRef, useEffect } from 'react';
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
  { label: 'Animation', value: { genre: '애니메이션' } },
];

interface HeaderProps {
  onFilter?: (filter: { genre?: string; region?: string } | null) => void;
  onSearch?: (query: string) => void;
  onSearchClear?: () => void;
}

export default function Header({ onFilter, onSearch, onSearchClear }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSelect = (item: typeof MENU_ITEMS[0]) => {
    onFilter?.(item.value);
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    onSearchClear?.();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setMenuOpen(false);
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    onSearchClear?.();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-center gap-3 relative">
          {/* 햄버거 메뉴 */}
          <button
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
            className="w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
            aria-label="메뉴"
          >
            <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-black transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>

          {/* 로고 */}
          <Link href="/" className="text-black font-black text-lg tracking-[-0.04em] uppercase"
            onClick={() => { setMenuOpen(false); setSearchOpen(false); setSearchQuery(''); onFilter?.(null); onSearchClear?.(); }}>
            Jennie Trailer
          </Link>

          {/* 검색 아이콘 */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
            className="absolute right-6 lg:right-10 w-8 h-8 flex items-center justify-center"
            aria-label="검색"
          >
            <svg className="w-5 h-5 text-black/60 hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 검색바 */}
        {searchOpen && (
          <div className="border-t border-black/5 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <svg className="w-4 h-4 text-black/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="영화, 드라마 제목 검색..."
                  className="flex-1 text-black text-lg font-medium bg-transparent border-none outline-none placeholder-black/20"
                />
                {searchQuery && (
                  <button type="button" onClick={handleSearchClose}
                    className="text-black/30 hover:text-black text-sm font-semibold uppercase tracking-[0.05em]">
                    Clear
                  </button>
                )}
              </form>
            </div>
          </div>
        )}
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
