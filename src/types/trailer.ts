export type ContentType = 'movie' | 'drama' | 'documentary';
export type TrailerType = 'teaser' | 'main' | 'final' | 'character' | 'special';
export type Region = 'domestic' | 'international';

export interface Trailer {
  id: string;
  title: string;
  titleOriginal: string;
  year: number;
  releaseDate: string;
  contentType: ContentType;
  country: string;
  region: Region;
  genres: string[];
  youtubeId: string;
  thumbnailUrl: string;
  trailerType: TrailerType;
  duration?: number;
  director?: string;
  studio?: string;
  platform?: string;
  editingStyle?: string[];
  mood?: string[];
  colorGrade?: string[];
  notes?: string;
  isFavorite?: boolean;
  source: 'tmdb' | 'manual';
  tmdbId?: number;
  addedAt: string;
  publishedAt: string;
}
