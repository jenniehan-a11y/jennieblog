'use client';

import { useState, useMemo, useEffect } from 'react';
import { Trailer } from '@/types/trailer';
import { FilterState, SortOption, DEFAULT_FILTERS } from '@/types/filters';
import { filterTrailers, sortTrailers } from '@/lib/filters';
import FilterPanel from './filter/FilterPanel';
import TrailerGrid from './trailer/TrailerGrid';

interface TrailerExplorerProps {
  initialTrailers: Trailer[];
}

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('newest');
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailers);

  // localStorage에서 즐겨찾기 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const favoriteIds: string[] = JSON.parse(saved);
      setTrailers((prev) =>
        prev.map((t) => ({
          ...t,
          isFavorite: favoriteIds.includes(t.id),
        }))
      );
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setTrailers((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      );
      // localStorage에 저장
      const favoriteIds = updated.filter((t) => t.isFavorite).map((t) => t.id);
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
      return updated;
    });
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = filterTrailers(trailers, filters);
    return sortTrailers(filtered, sort);
  }, [trailers, filters, sort]);

  return (
    <div className="space-y-6">
      <FilterPanel
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        resultCount={filteredAndSorted.length}
      />
      <TrailerGrid
        trailers={filteredAndSorted}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
