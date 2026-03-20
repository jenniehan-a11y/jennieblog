import { ContentType, TrailerType, Region } from './trailer';

export interface FilterState {
  contentType: ContentType[];
  region: Region | 'all';
  genres: string[];
  yearRange: [number, number];
  platform: string[];
  editingStyle: string[];
  mood: string[];
  trailerType: TrailerType[];
  isFavorite: boolean | null;
  searchQuery: string;
}

export type SortOption = 'newest' | 'oldest' | 'title' | 'year';

export const DEFAULT_FILTERS: FilterState = {
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
};
