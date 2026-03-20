import { Trailer } from '@/types/trailer';
import { FilterState, SortOption } from '@/types/filters';

export function filterTrailers(trailers: Trailer[], filters: FilterState): Trailer[] {
  return trailers.filter((trailer) => {
    // 콘텐츠 유형
    if (filters.contentType.length > 0 && !filters.contentType.includes(trailer.contentType)) {
      return false;
    }

    // 지역 (국내/해외)
    if (filters.region !== 'all' && trailer.region !== filters.region) {
      return false;
    }

    // 장르
    if (filters.genres.length > 0 && !filters.genres.some((g) => trailer.genres.includes(g))) {
      return false;
    }

    // 연도 범위
    if (trailer.year < filters.yearRange[0] || trailer.year > filters.yearRange[1]) {
      return false;
    }

    // 플랫폼
    if (filters.platform.length > 0) {
      if (!trailer.platform || !filters.platform.includes(trailer.platform)) {
        return false;
      }
    }

    // 편집 스타일
    if (
      filters.editingStyle.length > 0 &&
      (!trailer.editingStyle || !filters.editingStyle.some((s) => trailer.editingStyle?.includes(s)))
    ) {
      return false;
    }

    // 분위기
    if (
      filters.mood.length > 0 &&
      (!trailer.mood || !filters.mood.some((m) => trailer.mood?.includes(m)))
    ) {
      return false;
    }

    // 예고편 유형
    if (filters.trailerType.length > 0 && !filters.trailerType.includes(trailer.trailerType)) {
      return false;
    }

    // 즐겨찾기
    if (filters.isFavorite === true && !trailer.isFavorite) {
      return false;
    }

    // 검색어
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchTitle = trailer.title.toLowerCase().includes(query);
      const matchOriginal = trailer.titleOriginal.toLowerCase().includes(query);
      const matchDirector = trailer.director?.toLowerCase().includes(query);
      if (!matchTitle && !matchOriginal && !matchDirector) {
        return false;
      }
    }

    return true;
  });
}

export function sortTrailers(trailers: Trailer[], sort: SortOption): Trailer[] {
  const sorted = [...trailers];

  switch (sort) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      break;
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
      break;
    case 'year':
      sorted.sort((a, b) => b.year - a.year);
      break;
  }

  return sorted;
}
