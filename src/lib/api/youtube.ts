import { Trailer } from '@/types/trailer';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

// 공식 유튜브 채널
const CHANNELS = [
  // 한국 OTT/방송사
  { id: 'UCiEEF51uRAeZeCo8CJFhGWw', name: '넷플릭스 코리아', region: 'domestic' as const },
  { id: 'UCjn-VbcIkAeXQKCmLJV8YwQ', name: '쿠팡플레이', region: 'domestic' as const },
  { id: 'UC9w-h_ciMmX64TcLRcb1xPg', name: 'tvN DRAMA', region: 'domestic' as const },
  { id: 'UCNIiH_4ArJNd_cDZApZ7AFg', name: '티빙', region: 'domestic' as const },
  { id: 'UCbv7Dcn5iNrAyd3GwgVHkIQ', name: 'Disney Korea', region: 'domestic' as const },
  { id: 'UCqMxSHOEbn-f5nVCuDW5YbA', name: '웨이브', region: 'domestic' as const },
  { id: 'UCkbJc8jMcTXwhtmN5VMwfXg', name: 'JTBC Drama', region: 'domestic' as const },
  { id: 'UCcOYEm78CpaZQvPE6LtoSeA', name: 'SBS', region: 'domestic' as const },
  { id: 'UCaKod3X1Tn4c7Ci0iUKcvzQ', name: '왓챠', region: 'domestic' as const },
  { id: 'UCw0LjEsFRJCM0aIUZlYFHBQ', name: 'CJ ENM', region: 'domestic' as const },
  // 해외 스튜디오/OTT
  { id: 'UCWOA1ZGywLbqmigxE4Qlvuw', name: 'Netflix', region: 'international' as const },
  { id: 'UCjmJDM5pRKbUlVIzDYYWb6g', name: 'Warner Bros', region: 'international' as const },
  { id: 'UCi8e0iOVk1fEOogdfu4YgfA', name: 'Universal Pictures', region: 'international' as const },
  { id: 'UCuPivVjnfNo4mb3Oog_frZg', name: 'A24', region: 'international' as const },
  { id: 'UC_IRYSp4auq7hKLiRDGSzgg', name: 'Walt Disney Studios', region: 'international' as const },
  { id: 'UCnc6db-y3IU7CkT_yeVXdVg', name: 'Sony Pictures', region: 'international' as const },
];

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    publishedAt: string;
    channelTitle: string;
    resourceId: { videoId: string };
  };
}

function getUploadsPlaylistId(channelId: string): string {
  return 'UU' + channelId.substring(2);
}

// 예고편이 아닌 콘텐츠 제외 (티저 예고편은 포함!)
const excludeWords = [
  // 리뷰/리액션
  '리뷰', 'review', '리액션', 'reaction',
  // 짧은 영상
  '10초', '15초', '30초', 'shorts',
  // 비하인드/메이킹
  '비하인드', 'behind', '메이킹', 'making',
  // 하이라이트/명장면
  '하이라이트', 'highlight', '명장면',
  // 인터뷰/해설
  '인터뷰', 'interview', '해설', 'explain',
  // 요약
  '요약', 'recap',
  // 캐릭터/본편
  '캐릭터 영상', 'character video', '본편', '무삭제', 'deleted',
  // 선공개/엔딩
  '선공개', 'sneak peek', '엔딩 크레딧',
  // OST/뮤직비디오
  'ost', '뮤직비디오', 'music video',
  // 공연/콘서트/뮤지컬 (공연 예고편 제외)
  '공연', '콘서트', 'concert', '뮤지컬', 'musical', '내한', '페스티벌', 'festival',
  '팬미팅', 'fan meeting', '라이브', 'live performance',
  // 기타
  'featurette',
];

function isTrailerTitle(title: string): boolean {
  const lower = title.toLowerCase();
  // 예고편 관련 키워드
  const isTrailer = lower.includes('trailer') || lower.includes('예고편') || lower.includes('예고')
    || lower.includes('공식 발표') || lower.includes('announcement')
    || lower.includes('티저') || lower.includes('teaser')
    || lower.includes('coming soon') || lower.includes('first look');
  if (!isTrailer) return false;
  // 제외 목록 체크
  const isExcluded = excludeWords.some(w => lower.includes(w));
  return !isExcluded;
}

async function fetchChannelTrailers(channel: typeof CHANNELS[0]): Promise<Trailer[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const playlistId = getUploadsPlaylistId(channel.id);
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId,
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    });

    const res = await fetch(`${YOUTUBE_BASE}/playlistItems?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items: YouTubePlaylistItem[] = data.items || [];

    return items
      .filter(item => isTrailerTitle(item.snippet.title))
      .map(item => {
        const videoId = item.snippet.resourceId.videoId;
        return {
          id: `yt-${channel.id}-${videoId}`,
          title: item.snippet.title
            .replace(/\s*[\|\-]\s*Official Trailer.*/i, '')
            .replace(/\s*Official Trailer.*/i, '')
            .replace(/\s*[\|\-]\s*공식 예고편.*/i, '')
            .replace(/\s*공식 예고편.*/i, '')
            .replace(/\s*메인 예고편.*/i, '')
            .replace(/\s*티저 예고편.*/i, '')
            .trim() || item.snippet.title,
          titleOriginal: item.snippet.title,
          year: new Date(item.snippet.publishedAt).getFullYear(),
          releaseDate: item.snippet.publishedAt.split('T')[0],
          contentType: 'movie' as const,
          country: channel.region === 'domestic' ? 'KR' : 'US',
          region: channel.region,
          genres: [],
          youtubeId: videoId,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          trailerType: 'main' as const,
          platform: channel.name,
          source: 'manual' as const,
          addedAt: new Date().toISOString(),
          publishedAt: item.snippet.publishedAt,
        };
      });
  } catch {
    return [];
  }
}

export async function fetchYouTubeTrailers(): Promise<Trailer[]> {
  if (!YOUTUBE_API_KEY) return [];

  const results = await Promise.all(CHANNELS.map(fetchChannelTrailers));
  const all = results.flat();

  const seen = new Set<string>();
  return all.filter(t => {
    if (seen.has(t.youtubeId)) return false;
    seen.add(t.youtubeId);
    return true;
  });
}
