import { Trailer, ContentType } from '@/types/trailer';
import { MOVIE_GENRES, TV_GENRE_MAP } from '@/lib/data/genres';
import { getRegion } from '@/lib/data/countries';
import { fetchYouTubeTrailers } from './youtube';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  release_date: string;
  genre_ids: number[];
  origin_country?: string[];
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  original_language: string;
  first_air_date: string;
  genre_ids: number[];
  origin_country: string[];
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'ko-KR',
    ...params,
  });

  const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`);
  }

  return res.json();
}

// TMDB provider ID → 플랫폼 이름 매핑
const PROVIDER_MAP: Record<number, string> = {
  8: '넷플릭스',
  337: '디즈니+',
  356: '웨이브',
  97: '왓챠',
  2: 'Apple TV+',
  119: 'Amazon Prime',
  384: 'HBO Max',
  15: 'Hulu',
  1899: 'Max',
  // 한국 OTT
  350: '쿠팡플레이',
  668: '티빙',
  // 시즌은 TMDB에 없을 수 있음
};

async function getMovieProviders(movieId: number): Promise<string[]> {
  try {
    const data = await tmdbFetch<{ results: Record<string, { flatrate?: { provider_id: number; provider_name: string }[] }> }>(
      `/movie/${movieId}/watch/providers`
    );
    const krProviders = data.results?.KR?.flatrate || [];
    const usProviders = data.results?.US?.flatrate || [];
    const allProviders = [...krProviders, ...usProviders];

    const platforms: string[] = [];
    const seen = new Set<string>();
    for (const p of allProviders) {
      const name = PROVIDER_MAP[p.provider_id];
      if (name && !seen.has(name)) {
        seen.add(name);
        platforms.push(name);
      }
    }
    return platforms;
  } catch {
    return [];
  }
}

async function getTVProviders(tvId: number): Promise<string[]> {
  try {
    const data = await tmdbFetch<{ results: Record<string, { flatrate?: { provider_id: number; provider_name: string }[] }> }>(
      `/tv/${tvId}/watch/providers`
    );
    const krProviders = data.results?.KR?.flatrate || [];
    const usProviders = data.results?.US?.flatrate || [];
    const allProviders = [...krProviders, ...usProviders];

    const platforms: string[] = [];
    const seen = new Set<string>();
    for (const p of allProviders) {
      const name = PROVIDER_MAP[p.provider_id];
      if (name && !seen.has(name)) {
        seen.add(name);
        platforms.push(name);
      }
    }
    return platforms;
  } catch {
    return [];
  }
}

function mapTrailerType(type: string): Trailer['trailerType'] {
  switch (type.toLowerCase()) {
    case 'teaser': return 'teaser';
    case 'trailer': return 'main';
    case 'clip': return 'special';
    case 'featurette': return 'special';
    default: return 'main';
  }
}

// 해외 작품은 원어 버전, 국내 작품은 한국어 버전 예고편
async function getMovieVideos(movieId: number, originalLanguage: string): Promise<TMDBVideo[]> {
  const isKorean = originalLanguage === 'ko';

  if (isKorean) {
    // 국내: 한국어 먼저, 없으면 영어
    const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${movieId}/videos`, { language: 'ko-KR' });
    if (data.results.length > 0) return data.results;
    const en = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${movieId}/videos`, { language: 'en-US' });
    return en.results;
  } else {
    // 해외: 영어(원어) 먼저, 없으면 한국어
    const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${movieId}/videos`, { language: 'en-US' });
    if (data.results.length > 0) return data.results;
    const ko = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${movieId}/videos`, { language: 'ko-KR' });
    return ko.results;
  }
}

async function getTVVideos(tvId: number, originalLanguage: string): Promise<TMDBVideo[]> {
  const isKorean = originalLanguage === 'ko';

  if (isKorean) {
    const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${tvId}/videos`, { language: 'ko-KR' });
    if (data.results.length > 0) return data.results;
    const en = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${tvId}/videos`, { language: 'en-US' });
    return en.results;
  } else {
    const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${tvId}/videos`, { language: 'en-US' });
    if (data.results.length > 0) return data.results;
    const ko = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${tvId}/videos`, { language: 'ko-KR' });
    return ko.results;
  }
}

// 언어 코드 → 국가 코드 매핑 (origin_country가 없을 때 사용)
const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  ko: 'KR', en: 'US', ja: 'JP', zh: 'CN', fr: 'FR', de: 'DE',
  es: 'ES', it: 'IT', pt: 'BR', hi: 'IN', th: 'TH', sv: 'SE',
  da: 'DK', no: 'NO',
};

// 예고편 아닌 영상 제외 필터
function isValidTrailer(v: TMDBVideo): boolean {
  if (v.site !== 'YouTube') return false;
  // Trailer + Teaser 허용
  if (v.type !== 'Trailer' && v.type !== 'Teaser') return false;
  const name = v.name.toLowerCase();
  const excluded = [
    '리뷰', 'review', '30초', '15초', 'shorts',
    '하이라이트', 'highlight', '비하인드', 'behind', '메이킹', 'making',
    '리액션', 'reaction', '인터뷰', 'interview', '요약', 'recap',
    '해설', 'explain', 'featurette', '명장면', '스페셜',
    '캐릭터 영상', 'character video', '본편', '무삭제', 'deleted scene',
    '선공개', 'sneak peek', '엔딩 크레딧',
    'ost', '뮤직비디오', 'music video',
    '공연', '콘서트', 'concert', '뮤지컬', 'musical', '팬미팅',
  ];
  return !excluded.some(word => name.includes(word));
}

function movieToTrailers(movie: TMDBMovie, videos: TMDBVideo[], platforms: string[] = []): Trailer[] {
  const youtubeVideos = videos.filter(isValidTrailer);

  const country = movie.origin_country?.[0] || LANGUAGE_TO_COUNTRY[movie.original_language] || 'US';
  const year = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0;
  const genres = movie.genre_ids.map((id) => MOVIE_GENRES[id]).filter(Boolean);

  // 같은 영화에서 트레일러 1개만 (가장 최신)
  const sorted = youtubeVideos.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const best = sorted.slice(0, 1);

  return best.map((video) => ({
    id: `movie-${movie.id}-${video.id}`,
    title: movie.title || movie.original_title,
    titleOriginal: movie.original_title,
    year,
    releaseDate: movie.release_date || '',
    contentType: 'movie' as ContentType,
    country,
    region: getRegion(country),
    genres,
    youtubeId: video.key,
    thumbnailUrl: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
    trailerType: mapTrailerType(video.type),
    platform: platforms[0] || undefined,
    source: 'tmdb' as const,
    tmdbId: movie.id,
    addedAt: new Date().toISOString(),
    publishedAt: video.published_at || movie.release_date || '',
  }));
}

function tvToTrailers(show: TMDBTVShow, videos: TMDBVideo[], platforms: string[] = []): Trailer[] {
  const youtubeVideos = videos.filter(isValidTrailer);

  const country = show.origin_country?.[0] || LANGUAGE_TO_COUNTRY[show.original_language] || 'US';
  const year = show.first_air_date ? parseInt(show.first_air_date.substring(0, 4)) : 0;
  const genreIds = show.genre_ids;
  // TV 장르: 복합 장르를 개별로 분리 (액션/모험 → [액션, 모험])
  const genres = [...new Set(genreIds.flatMap((id) => TV_GENRE_MAP[id] || []))];
  const isDocumentary = genreIds.includes(99);
  const contentType: ContentType = isDocumentary ? 'documentary' : 'drama';

  const sorted = youtubeVideos.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const best = sorted.slice(0, 1);

  return best.map((video) => ({
    id: `tv-${show.id}-${video.id}`,
    title: show.name || show.original_name,
    titleOriginal: show.original_name,
    year,
    releaseDate: show.first_air_date || '',
    contentType,
    country,
    region: getRegion(country),
    genres,
    youtubeId: video.key,
    thumbnailUrl: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
    trailerType: mapTrailerType(video.type),
    platform: platforms[0] || undefined,
    source: 'tmdb' as const,
    tmdbId: show.id,
    addedAt: new Date().toISOString(),
    publishedAt: video.published_at || show.first_air_date || '',
  }));
}

export async function fetchPopularMovieTrailers(page: number = 1): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBMovie[] }>('/movie/popular', {
    page: page.toString(),
    region: 'KR',
  });

  const allTrailers: Trailer[] = [];

  for (const movie of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getMovieVideos(movie.id, movie.original_language),
        getMovieProviders(movie.id),
      ]);
      const trailers = movieToTrailers(movie, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // 개별 영화 에러는 무시하고 계속 진행
    }
  }

  return allTrailers;
}

export async function fetchPopularTVTrailers(page: number = 1): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBTVShow[] }>('/tv/popular', {
    page: page.toString(),
  });

  const allTrailers: Trailer[] = [];

  for (const show of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getTVVideos(show.id, show.original_language),
        getTVProviders(show.id),
      ]);
      const trailers = tvToTrailers(show, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // 개별 드라마 에러는 무시하고 계속 진행
    }
  }

  return allTrailers;
}

export async function fetchNowPlayingTrailers(): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBMovie[] }>('/movie/now_playing', {
    region: 'KR',
  });

  const allTrailers: Trailer[] = [];

  for (const movie of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getMovieVideos(movie.id, movie.original_language),
        getMovieProviders(movie.id),
      ]);
      const trailers = movieToTrailers(movie, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function fetchUpcomingTrailers(): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBMovie[] }>('/movie/upcoming', {
    region: 'KR',
  });

  const allTrailers: Trailer[] = [];

  for (const movie of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getMovieVideos(movie.id, movie.original_language),
        getMovieProviders(movie.id),
      ]);
      const trailers = movieToTrailers(movie, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function fetchKoreanMovieTrailers(page: number = 1): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBMovie[] }>('/discover/movie', {
    with_origin_country: 'KR',
    sort_by: 'release_date.desc',
    page: page.toString(),
  });

  const allTrailers: Trailer[] = [];

  for (const movie of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getMovieVideos(movie.id, movie.original_language),
        getMovieProviders(movie.id),
      ]);
      const trailers = movieToTrailers(movie, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function fetchKoreanDramaTrailers(page: number = 1): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBTVShow[] }>('/discover/tv', {
    with_origin_country: 'KR',
    sort_by: 'first_air_date.desc',
    page: page.toString(),
  });

  const allTrailers: Trailer[] = [];

  for (const show of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getTVVideos(show.id, show.original_language),
        getTVProviders(show.id),
      ]);
      const trailers = tvToTrailers(show, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function fetchTopRatedTVTrailers(page: number = 1): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBTVShow[] }>('/tv/top_rated', {
    page: page.toString(),
  });

  const allTrailers: Trailer[] = [];

  for (const show of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getTVVideos(show.id, show.original_language),
        getTVProviders(show.id),
      ]);
      const trailers = tvToTrailers(show, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function fetchAiringTodayTVTrailers(): Promise<Trailer[]> {
  const data = await tmdbFetch<{ results: TMDBTVShow[] }>('/tv/on_the_air', {
    page: '1',
  });

  const allTrailers: Trailer[] = [];

  for (const show of data.results) {
    try {
      const [videos, platforms] = await Promise.all([
        getTVVideos(show.id, show.original_language),
        getTVProviders(show.id),
      ]);
      const trailers = tvToTrailers(show, videos, platforms);
      allTrailers.push(...trailers);
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function searchTrailers(query: string): Promise<Trailer[]> {
  const [movieData, tvData] = await Promise.all([
    tmdbFetch<{ results: TMDBMovie[] }>('/search/movie', { query }),
    tmdbFetch<{ results: TMDBTVShow[] }>('/search/tv', { query }),
  ]);

  const allTrailers: Trailer[] = [];

  for (const movie of movieData.results.slice(0, 10)) {
    try {
      const videos = await getMovieVideos(movie.id, movie.original_language);
      allTrailers.push(...movieToTrailers(movie, videos));
    } catch {
      // skip
    }
  }

  for (const show of tvData.results.slice(0, 10)) {
    try {
      const videos = await getTVVideos(show.id, show.original_language);
      allTrailers.push(...tvToTrailers(show, videos));
    } catch {
      // skip
    }
  }

  return allTrailers;
}

export async function fetchAllTrailers(): Promise<Trailer[]> {
  const [
    popularMovies1,
    popularMovies2,
    popularMovies3,
    popularTV1,
    popularTV2,
    popularTV3,
    topRatedTV1,
    topRatedTV2,
    airingTV,
    nowPlaying,
    upcoming,
    koreanMovies1,
    koreanMovies2,
    koreanDramas1,
    koreanDramas2,
    koreanDramas3,
    youtubeTrailers,
  ] = await Promise.all([
    fetchPopularMovieTrailers(1),
    fetchPopularMovieTrailers(2),
    fetchPopularMovieTrailers(3),
    fetchPopularTVTrailers(1),
    fetchPopularTVTrailers(2),
    fetchPopularTVTrailers(3),
    fetchTopRatedTVTrailers(1),
    fetchTopRatedTVTrailers(2),
    fetchAiringTodayTVTrailers(),
    fetchNowPlayingTrailers(),
    fetchUpcomingTrailers(),
    fetchKoreanMovieTrailers(1),
    fetchKoreanMovieTrailers(2),
    fetchKoreanDramaTrailers(1),
    fetchKoreanDramaTrailers(2),
    fetchKoreanDramaTrailers(3),
    fetchYouTubeTrailers(),
  ]);

  const all = [
    ...popularMovies1,
    ...popularMovies2,
    ...popularMovies3,
    ...popularTV1,
    ...popularTV2,
    ...popularTV3,
    ...topRatedTV1,
    ...topRatedTV2,
    ...airingTV,
    ...nowPlaying,
    ...upcoming,
    ...koreanMovies1,
    ...koreanMovies2,
    ...koreanDramas1,
    ...koreanDramas2,
    ...koreanDramas3,
    ...youtubeTrailers,
  ];

  // 중복 제거 (같은 작품은 1개만)
  const seenTmdb = new Set<string>();
  const seenYt = new Set<string>();
  const unique = all.filter((t) => {
    const tmdbKey = `${t.contentType}-${t.tmdbId}`;
    if (seenTmdb.has(tmdbKey) || seenYt.has(t.youtubeId)) return false;
    seenTmdb.add(tmdbKey);
    seenYt.add(t.youtubeId);
    return true;
  });

  // 최신순 정렬
  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return unique;
}
