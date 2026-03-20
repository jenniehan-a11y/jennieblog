'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Trailer } from '@/types/trailer';
import { FilterState, SortOption, DEFAULT_FILTERS } from '@/types/filters';
import { filterTrailers, sortTrailers } from '@/lib/filters';
import { getCountryInfo } from '@/lib/data/countries';
import { CONTENT_TYPE_LABELS } from '@/lib/data/tags';
import FilterPanel from './filter/FilterPanel';
import TrailerGrid from './trailer/TrailerGrid';
import TrailerModal from './trailer/TrailerModal';

interface TrailerExplorerProps {
  initialTrailers: Trailer[];
}

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('newest');
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailers);
  const [heroTrailer, setHeroTrailer] = useState<Trailer | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const ids: string[] = JSON.parse(saved);
      setTrailers(prev => prev.map(t => ({ ...t, isFavorite: ids.includes(t.id) })));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setTrailers(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t);
      localStorage.setItem('favorites', JSON.stringify(updated.filter(t => t.isFavorite).map(t => t.id)));
      return updated;
    });
  };

  const result = useMemo(() => sortTrailers(filterTrailers(trailers, filters), sort), [trailers, filters, sort]);

  // 히어로: 첫 번째 예고편
  const hero = result[0];
  const heroCountry = hero ? getCountryInfo(hero.country) : null;

  return (
    <div className="space-y-8">
      {/* 히어로 섹션 */}
      {hero && !filters.searchQuery && filters.contentType.length === 0 && filters.genres.length === 0 && (
        <div
          className="relative h-[420px] rounded-2xl overflow-hidden cursor-pointer group ring-1 ring-white/[0.04]"
          onClick={() => setHeroTrailer(hero)}
        >
          <Image
            src={`https://img.youtube.com/vi/${hero.youtubeId}/maxresdefault.jpg`}
            alt={hero.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* 재생 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* 텍스트 */}
          <div className="absolute bottom-0 left-0 p-8 max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              {hero.platform && (
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-[11px] text-white/80 font-medium border border-white/[0.08]">
                  {hero.platform}
                </span>
              )}
              <span className="text-white/40 text-[12px]">
                {heroCountry?.flag} {CONTENT_TYPE_LABELS[hero.contentType]} · {hero.year}
              </span>
            </div>
            <h2 className="text-white text-3xl font-bold tracking-[-0.03em] leading-tight">
              {hero.title}
            </h2>
            {hero.genres.length > 0 && (
              <p className="text-white/30 text-sm mt-2">{hero.genres.join(' · ')}</p>
            )}
          </div>
        </div>
      )}

      {/* 필터 */}
      <FilterPanel
        filters={filters} sort={sort}
        onFiltersChange={setFilters} onSortChange={setSort}
        resultCount={result.length}
      />

      {/* 그리드 */}
      <TrailerGrid
        trailers={hero && !filters.searchQuery && filters.contentType.length === 0 && filters.genres.length === 0 ? result.slice(1) : result}
        onToggleFavorite={toggleFavorite}
      />

      {/* 히어로 모달 */}
      {heroTrailer && <TrailerModal trailer={heroTrailer} onClose={() => setHeroTrailer(null)} />}
    </div>
  );
}
