'use client';

import { useState } from 'react';
import { FilterState, SortOption } from '@/types/filters';
import { FILTER_GENRES } from '@/lib/data/genres';
import { PLATFORMS } from '@/lib/data/tags';
import { ContentType } from '@/types/trailer';
import FilterChips from './FilterChips';
import FilterTabs from './FilterTabs';
import SortSelect from './SortSelect';

interface FilterPanelProps {
  filters: FilterState;
  sort: SortOption;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

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
  const [expanded, setExpanded] = useState(false);

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

  const activeFilterCount =
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
    <div className="space-y-5">
      {/* 1행: 지역 탭 + 검색 + 필터 토글 */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <FilterTabs value={filters.region} onChange={(region) => update({ region })} />
          <button
            onClick={() => setExpanded(!expanded)}
            className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              expanded || activeFilterCount > 0
                ? 'bg-[#f5f5f7] text-black'
                : 'text-[#86868b] hover:text-[#f5f5f7] border border-[#38383a] hover:border-[#636366]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            필터
            {activeFilterCount > 0 && (
              <span className="bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="검색..."
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            className="bg-[#1c1c1e] text-[#f5f5f7] text-[13px] rounded-full px-4 py-2.5 border border-[#38383a] focus:outline-none focus:border-[#636366] w-48 placeholder-[#636366] transition-colors"
          />
          <SortSelect value={sort} onChange={onSortChange} />
        </div>
      </div>

      {/* 2행: 콘텐츠 유형 + 즐겨찾기 (항상 보임) */}
      <div className="flex items-center gap-2">
        {contentTypes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => toggleContentType(value)}
            className={`px-4 py-2 text-[13px] rounded-full transition-all duration-200 ${
              filters.contentType.includes(value)
                ? 'bg-[#f5f5f7] text-black font-medium'
                : 'text-[#86868b] hover:text-[#f5f5f7] border border-[#38383a] hover:border-[#636366]'
            }`}
          >
            {label}
          </button>
        ))}

        <div className="w-px h-5 bg-[#38383a] mx-1" />

        <button
          onClick={() => update({ isFavorite: filters.isFavorite ? null : true })}
          className={`px-4 py-2 text-[13px] rounded-full transition-all duration-200 ${
            filters.isFavorite
              ? 'bg-amber-500/20 text-amber-400 font-medium border border-amber-500/30'
              : 'text-[#86868b] hover:text-[#f5f5f7] border border-[#38383a] hover:border-[#636366]'
          }`}
        >
          ⭐ 즐겨찾기
        </button>

        {activeFilterCount > 0 && (
          <>
            <div className="w-px h-5 bg-[#38383a] mx-1" />
            <button
              onClick={resetFilters}
              className="text-[#636366] hover:text-[#f5f5f7] text-[12px] transition-colors"
            >
              초기화
            </button>
          </>
        )}

        <span className="ml-auto text-[#48484a] text-[12px] tabular-nums">
          {resultCount}개
        </span>
      </div>

      {/* 확장 필터 (토글) */}
      {expanded && (
        <div className="space-y-5 pt-3 border-t border-[#1c1c1e] animate-in fade-in duration-200">
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
