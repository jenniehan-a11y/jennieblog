'use client';

import { useState } from 'react';
import { FilterState, SortOption } from '@/types/filters';
import { FILTER_GENRES } from '@/lib/data/genres';
import { PLATFORMS } from '@/lib/data/tags';
import { ContentType, Region } from '@/types/trailer';

interface FilterPanelProps {
  filters: FilterState;
  sort: SortOption;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const regions: { value: Region | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'domestic', label: '국내' },
  { value: 'international', label: '해외' },
];

const types: { value: ContentType; label: string }[] = [
  { value: 'movie', label: '영화' },
  { value: 'drama', label: '드라마' },
  { value: 'documentary', label: '다큐' },
];

const sorts: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'title', label: '제목순' },
];

export default function FilterPanel({
  filters, sort, onFiltersChange, onSortChange, resultCount,
}: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (p: Partial<FilterState>) => onFiltersChange({ ...filters, ...p });

  const toggleType = (t: ContentType) => {
    const c = filters.contentType;
    update({ contentType: c.includes(t) ? c.filter(x => x !== t) : [...c, t] });
  };

  const toggleGenre = (g: string) => {
    const c = filters.genres;
    update({ genres: c.includes(g) ? c.filter(x => x !== g) : [...c, g] });
  };

  const togglePlatform = (p: string) => {
    const c = filters.platform;
    update({ platform: c.includes(p) ? c.filter(x => x !== p) : [...c, p] });
  };

  const activeCount = filters.contentType.length + (filters.region !== 'all' ? 1 : 0) +
    filters.genres.length + filters.platform.length + (filters.isFavorite ? 1 : 0);

  const reset = () => onFiltersChange({
    contentType: [], region: 'all', genres: [], yearRange: [2000, new Date().getFullYear()],
    platform: [], editingStyle: [], mood: [], trailerType: [], isFavorite: null, searchQuery: '',
  });

  return (
    <div className="space-y-5">
      {/* 메인 바 */}
      <div className="flex items-center gap-6">
        {/* 지역 */}
        <div className="flex items-center">
          {regions.map(r => (
            <button key={r.value} onClick={() => update({ region: r.value })}
              className={`px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-all relative ${
                filters.region === r.value ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}>
              {r.label}
              {filters.region === r.value && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
              )}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/[0.06]" />

        {/* 콘텐츠 유형 */}
        <div className="flex gap-1.5">
          {types.map(t => (
            <button key={t.value} onClick={() => toggleType(t.value)}
              className={`px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all ${
                filters.contentType.includes(t.value)
                  ? 'bg-white text-black'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/[0.06]" />

        {/* 필터 + 즐겨찾기 */}
        <button onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all ${
            expanded ? 'bg-violet-500/15 text-violet-300' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
          }`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          필터
          {(filters.genres.length + filters.platform.length) > 0 && (
            <span className="ml-0.5 w-4 h-4 rounded-full bg-violet-500 text-[9px] text-white flex items-center justify-center font-bold">
              {filters.genres.length + filters.platform.length}
            </span>
          )}
        </button>

        <button onClick={() => update({ isFavorite: filters.isFavorite ? null : true })}
          className={`px-3.5 py-1.5 text-[12px] font-medium rounded-full transition-all ${
            filters.isFavorite ? 'bg-amber-400/15 text-amber-300' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
          }`}>
          ★ 즐겨찾기
        </button>

        {activeCount > 0 && (
          <button onClick={reset} className="text-white/20 hover:text-white/40 text-[11px]">초기화</button>
        )}

        {/* 우측 */}
        <div className="ml-auto flex items-center gap-4">
          <div className="relative group">
            <svg className="w-4 h-4 text-white/15 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="검색..." value={filters.searchQuery}
              onChange={(e) => update({ searchQuery: e.target.value })}
              className="w-44 bg-white/[0.03] text-white/80 text-[12px] rounded-full pl-9 pr-4 py-2 border border-white/[0.04] focus:border-violet-500/30 focus:outline-none focus:bg-white/[0.05] placeholder-white/15 transition-all" />
          </div>

          <div className="flex gap-0.5 bg-white/[0.03] rounded-full p-0.5">
            {sorts.map(s => (
              <button key={s.value} onClick={() => onSortChange(s.value)}
                className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all ${
                  sort === s.value ? 'bg-white/[0.08] text-white/70' : 'text-white/20 hover:text-white/40'
                }`}>
                {s.label}
              </button>
            ))}
          </div>

          <span className="text-white/10 text-[11px] font-mono">{resultCount}</span>
        </div>
      </div>

      {/* 확장: 장르 + 플랫폼 */}
      {expanded && (
        <div className="space-y-4 pb-2 fade-in">
          {/* 장르 */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-white/15 tracking-[0.2em] uppercase">장르</p>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_GENRES.map(g => (
                <button key={g} onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all ${
                    filters.genres.includes(g)
                      ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-200'
                      : 'border-white/[0.04] text-white/25 hover:text-white/50 hover:border-white/[0.08]'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          {/* 플랫폼 */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-white/15 tracking-[0.2em] uppercase">플랫폼</p>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all ${
                    filters.platform.includes(p)
                      ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-200'
                      : 'border-white/[0.04] text-white/25 hover:text-white/50 hover:border-white/[0.08]'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
