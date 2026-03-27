'use client';

import { useState, useMemo, useCallback } from 'react';
import { Trailer } from '@/types/trailer';
import Header from './layout/Header';
import TrailerCard from './trailer/TrailerCard';
import TrailerModal from './trailer/TrailerModal';

interface TrailerExplorerProps {
  initialTrailers: Trailer[];
}

const GENRE_LABELS: Record<string, string> = {
  '액션': 'Action', '스릴러': 'Thriller', '공포': 'Horror', 'SF': 'Sci-Fi',
  '로맨스': 'Romance', '드라마': 'Drama', '코미디': 'Comedy', '범죄': 'Crime',
  '판타지': 'Fantasy', '미스터리': 'Mystery', '애니메이션': 'Animation',
};

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [heroModal, setHeroModal] = useState<Trailer | null>(null);
  const [gridModal, setGridModal] = useState<Trailer | null>(null);
  const [filter, setFilter] = useState<{ genre?: string; region?: string } | null>(null);
  const [searchResults, setSearchResults] = useState<Trailer[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const filtered = useMemo(() => {
    if (!filter) return initialTrailers;
    if (filter.genre === '애니메이션') {
      return initialTrailers.filter(t => t.genres.includes('애니메이션'));
    }
    if (filter.genre) {
      return initialTrailers.filter(t => t.genres.includes(filter.genre!) && !t.genres.includes('애니메이션'));
    }
    if (filter.region) return initialTrailers.filter(t => t.region === filter.region);
    return initialTrailers;
  }, [initialTrailers, filter]);

  const hero = initialTrailers[0];

  const activeLabel = filter?.genre
    ? GENRE_LABELS[filter.genre] || filter.genre
    : filter?.region === 'domestic' ? 'Korea'
    : filter?.region === 'international' ? 'International'
    : null;

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setSearching(true);
    setFilter(null);
    try {
      // 사이트 내 예고편 검색 (YouTube 소스 포함)
      const q = query.toLowerCase();
      const localResults = initialTrailers.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.titleOriginal.toLowerCase().includes(q)
      );

      // TMDB 검색 (사이트에 없는 예고편도 찾기)
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const tmdbResults = res.ok ? await res.json() : [];

      // 합치고 중복 제거
      const seenIds = new Set(localResults.map((t: { youtubeId: string }) => t.youtubeId));
      const combined = [...localResults, ...tmdbResults.filter((t: { youtubeId: string }) => !seenIds.has(t.youtubeId))];
      setSearchResults(combined);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, [initialTrailers]);

  const handleSearchClear = useCallback(() => {
    setSearchResults(null);
    setSearchQuery('');
  }, []);

  const handleFilter = useCallback((f: { genre?: string; region?: string } | null) => {
    setFilter(f);
    setSearchResults(null);
    setSearchQuery('');
  }, []);

  // 검색 모드인지
  const isSearchMode = searchResults !== null;
  const displayTrailers = isSearchMode ? searchResults : filtered;
  const title = isSearchMode
    ? `"${searchQuery}"`
    : activeLabel || 'All Trailers';

  return (
    <>
      <Header onFilter={handleFilter} onSearch={handleSearch} onSearchClear={handleSearchClear} />

      <div className="pt-10 pb-32 space-y-24">
        {/* 히어로: 필터/검색 없을 때만 */}
        {!filter && !isSearchMode && hero && (
          <section>
            <div className="relative aspect-video overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${hero.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${hero.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                className="absolute inset-0 w-full h-full pointer-events-none"
                title={hero.title}
              />
              <button
                onClick={() => setHeroModal(hero)}
                className="absolute bottom-6 right-6 z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.08em] rounded-full shadow-xl hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Full Trailer
              </button>
            </div>
          </section>
        )}

        {/* 트레일러 그리드 */}
        <section className="px-10 lg:px-20">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-black text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.04em] uppercase leading-[0.9]">
              {title}
            </h2>
            <span className="text-black/20 text-sm font-medium">
              {searching ? '검색 중...' : `${displayTrailers.length}`}
            </span>
          </div>

          {searching ? (
            <div className="text-center py-20">
              <p className="text-black/30 text-sm">검색 중...</p>
            </div>
          ) : displayTrailers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-black/30 text-sm">
                {isSearchMode ? '검색 결과가 없습니다' : '예고편이 없습니다'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
              {displayTrailers.map(t => (
                <TrailerCard key={t.id} trailer={t} onPlay={setGridModal} />
              ))}
            </div>
          )}
        </section>
      </div>

      {heroModal && <TrailerModal trailer={heroModal} onClose={() => setHeroModal(null)} />}
      {gridModal && <TrailerModal trailer={gridModal} onClose={() => setGridModal(null)} />}
    </>
  );
}
