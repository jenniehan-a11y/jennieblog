'use client';

import { useState } from 'react';
import { FilterState, SortOption } from '@/types/filters';
import { FILTER_GENRES } from '@/lib/data/genres';
import { PLATFORMS } from '@/lib/data/tags';
import { ContentType } from '@/types/trailer';
import FilterChips from './FilterChips';
import SortSelect from './SortSelect';

interface FilterPanelProps {
  filters: FilterState;
  sort: SortOption;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const regionOptions = [
  { value: 'all' as const, label: '전체' },
  { value: 'domestic' as const, label: '국내' },
  { value: 'international' as const, label: '해외' },
];

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'movie', label: '영화' },
  { value: 'drama', label: '드라마' },
  { value: 'documentary', label: '다큐' },
];

export default function FilterPanel({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  resultCount,
}: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const toggleContentType = (type: ContentType) => {
    const current = filters.contentType;
    if (current.includes(type)) {
      update({ contentType: current.filter((t) => t !== type) });
    } else {
      update({ contentType: [...current, type] });
    }
  };

  const activeCount =
    filters.contentType.length +
    (filters.region !== 'all' ? 1 : 0) +
    filters.genres.length +
    filters.platform.length +
    (filters.isFavorite ? 1 : 0);

  const resetFilters = () => {
    onFiltersChange({
      contentType: [],
      region: 'all',
      genres: [],
      yearRange: [2000, new Date().getFullYear()],
      platform: [],
      editingStyle: [],
      mood: [],
      trailerType: [],
      isFavorite: null,
      searchQuery: '',
    });
  };

  return (
    <div className="space-y-3">
      {/* 1행: 지역 + 콘텐츠 유형 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 지역 탭 */}
        <div className="inline-flex bg-white/[0.04] rounded-xl p-1">
          {regionOptions.map((tab) => (
            <button
              key={tab.value}
              onClick={() => update({ region: tab.value })}
              className={`px-4 py-1.5 text-[12px] font-medium rounded-[10px] transition-all duration-200 ${
                filters.region === tab.value
                  ? 'bg-white text-[#0a0a0a] shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/[0.06] mx-1" />

        {/* 콘텐츠 유형 */}
        {contentTypes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => toggleContentType(value)}
            className={`px-3.5 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
              filters.contentType.includes(value)
                ? 'bg-white text-[#0a0a0a]'
                : 'text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            {label}
          </button>
        ))}

        <div className="h-4 w-px bg-white/[0.06] mx-1" />

        {/* 즐겨찾기 */}
        <button
          onClick={() => update({ isFavorite: filters.isFavorite ? null : true })}
          className={`px-3.5 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
            filters.isFavorite
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
              : 'text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          ⭐ 즐겨찾기
        </button>

        {activeCount > 0 && (
          <button onClick={resetFilters} className="text-white/20 hover:text-white/50 text-[11px] transition-colors">
            초기화
          </button>
        )}
      </div>

      {/* 2행: 필터 토글 + 검색 + 정렬 + 개수 */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
            showFilters || filters.genres.length > 0 || filters.platform.length > 0
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
              : 'text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          장르 · 플랫폼
          {(filters.genres.length + filters.platform.length) > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center font-bold">
              {filters.genres.length + filters.platform.length}
            </span>
          )}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <svg className="w-3.5 h-3.5 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="검색"
              value={filters.searchQuery}
              onChange={(e) => update({ searchQuery: e.target.value })}
              className="bg-white/[0.04] text-white text-[12px] rounded-lg pl-9 pr-3 py-1.5 border border-white/[0.06] focus:outline-none focus:border-indigo-500/30 w-36 placeholder-white/20 transition-all"
            />
          </div>
          <SortSelect value={sort} onChange={onSortChange} />
          <span className="text-white/15 text-[11px] font-medium tabular-nums">
            {resultCount}개
          </span>
        </div>
      </div>

      {/* 확장 필터 */}
      {showFilters && (
        <div className="space-y-5 pt-4 pb-2 border-t border-white/[0.04] animate-fade-up">
          <FilterChips
            label="장르"
            options={FILTER_GENRES}
            selected={filters.genres}
            onChange={(genres) => update({ genres })}
          />
          <FilterChips
            label="플랫폼"
            options={PLATFORMS}
            selected={filters.platform}
            onChange={(platform) => update({ platform })}
          />
        </div>
      )}
    </div>
  );
}
