import { Trailer } from '@/types/trailer';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

// 공식 유튜브 채널 목록
const CHANNELS = [
  // 한국 OTT/배급사
  { id: 'UCiEEF51uRAeZeCo8CJFhGWw', name: '넷플릭스 코리아', region: 'domestic' as const },
  { id: 'UCt4jGMWMwMZMbqaFKkp4GQg', name: '디즈니+ 코리아', region: 'domestic' as const },
  { id: 'UC1gxHEm3JwMwaB1YqpjDSwA', name: '티빙', region: 'domestic' as const },
  { id: 'UCbFoS1h4MM5hhUMCH62WxOQ', name: '쿠팡플레이', region: 'domestic' as const },
  { id: 'UCqMxSHOEbn-f5nVCuDW5YbA', name: '웨이브', region: 'domestic' as const },
  { id: 'UCw0LjEsFRJCM0aIUZlYFHBQ', name: 'CJ ENM', region: 'domestic' as const },
  // 해외 스튜디오/배급사
  { id: 'UCuPivVjnfNo4mb3Oog_frZg', name: 'A24', region: 'international' as const },
  { id: 'UCJ6nMHaJPZvsJ-HmUmj1SeA', name: 'Lionsgate', region: 'international' as const },
  { id: 'UCjmJDM5pRKbUlVIzDYYWb6g', name: 'Warner Bros', region: 'international' as const },
  { id: 'UCnc6db-y3IU7CkT_yeVXdVg', name: 'Sony Pictures', region: 'international' as const },
  { id: 'UCi8e0iOVk1fEOogdfu4YgfA', name: 'Universal Pictures', region: 'international' as const },
  { id: 'UC_IRYSp4auq7hKLiRDGSzgg', name: 'Walt Disney Studios', region: 'international' as const },
  { id: 'UCynfGRBFmWjZ3g62OBVIzVQ', name: 'Netflix', region: 'international' as const },
];

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails: { high?: { url: string }; medium?: { url: string } };
  };
}

async function fetchChannelTrailers(channel: typeof CHANNELS[0]): Promise<Trailer[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId: channel.id,
      q: 'official trailer|예고편|공식 예고편',
      type: 'video',
      order: 'date',
      maxResults: '15',
      key: YOUTUBE_API_KEY,
    });

    const res = await fetch(`${YOUTUBE_BASE}/search?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items: YouTubeSearchItem[] = data.items || [];

    return items
      .filter(item => {
        const title = item.snippet.title.toLowerCase();
        const isTrailer = title.includes('trailer') || title.includes('예고') || title.includes('예고편') || title.includes('official');
        // 리뷰, 30초, 15초, 숏츠, 하이라이트, 비하인드, 메이킹 등 제외
        const isExcluded = title.includes('review') || title.includes('리뷰') ||
          title.includes('30초') || title.includes('15초') || title.includes('shorts') ||
          title.includes('highlight') || title.includes('하이라이트') ||
          title.includes('behind') || title.includes('비하인드') ||
          title.includes('making') || title.includes('메이킹') ||
          title.includes('reaction') || title.includes('리액션') ||
          title.includes('interview') || title.includes('인터뷰') ||
          title.includes('recap') || title.includes('요약') ||
          title.includes('explain') || title.includes('해설');
        return isTrailer && !isExcluded;
      })
      .map(item => ({
        id: `yt-${channel.id}-${item.id.videoId}`,
        title: item.snippet.title
          .replace(/\s*[\|\-]\s*Official Trailer.*/i, '')
          .replace(/\s*Official Trailer.*/i, '')
          .replace(/\s*[\|\-]\s*공식 예고편.*/i, '')
          .replace(/\s*메인 예고편.*/i, '')
          .replace(/\s*예고편.*/i, '')
          .trim() || item.snippet.title,
        titleOriginal: item.snippet.title,
        year: new Date(item.snippet.publishedAt).getFullYear(),
        releaseDate: item.snippet.publishedAt.split('T')[0],
        contentType: 'movie' as const,
        country: channel.region === 'domestic' ? 'KR' : 'US',
        region: channel.region,
        genres: [],
        youtubeId: item.id.videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${item.id.videoId}/mqdefault.jpg`,
        trailerType: 'main' as const,
        platform: channel.name,
        source: 'manual' as const,
        addedAt: new Date().toISOString(),
        publishedAt: item.snippet.publishedAt,
      }));
  } catch {
    return [];
  }
}

export async function fetchYouTubeTrailers(): Promise<Trailer[]> {
  if (!YOUTUBE_API_KEY) return [];

  const results = await Promise.all(CHANNELS.map(fetchChannelTrailers));
  const all = results.flat();

  // youtubeId 기준 중복 제거
  const seen = new Set<string>();
  return all.filter(t => {
    if (seen.has(t.youtubeId)) return false;
    seen.add(t.youtubeId);
    return true;
  });
}
