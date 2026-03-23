import { Trailer } from '@/types/trailer';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

// 공식 유튜브 채널 — 핵심만 (쿼터 절약)
const CHANNELS = [
  // 한국 OTT/방송사
  { id: 'UCiEEF51uRAeZeCo8CJFhGWw', name: '넷플릭스 코리아', region: 'domestic' as const },
  { id: 'UCjn-VbcIkAeXQKCmLJV8YwQ', name: '쿠팡플레이', region: 'domestic' as const },
  { id: 'UC9w-h_ciMmX64TcLRcb1xPg', name: 'tvN DRAMA', region: 'domestic' as const },
  { id: 'UC1gxHEm3JwMwaB1YqpjDSwA', name: '티빙', region: 'domestic' as const },
  { id: 'UCt4jGMWMwMZMbqaFKkp4GQg', name: '디즈니+ 코리아', region: 'domestic' as const },
  { id: 'UCqMxSHOEbn-f5nVCuDW5YbA', name: '웨이브', region: 'domestic' as const },
  { id: 'UCbvhmRig-3AONuGXJCRpirg', name: 'JTBC Drama', region: 'domestic' as const },
  { id: 'UCaKod3X1Tn4c7Ci0iUKcvzQ', name: '왓챠', region: 'domestic' as const },
  // 해외 스튜디오
  { id: 'UCjmJDM5pRKbUlVIzDYYWb6g', name: 'Warner Bros', region: 'international' as const },
  { id: 'UCi8e0iOVk1fEOogdfu4YgfA', name: 'Universal Pictures', region: 'international' as const },
  { id: 'UCuPivVjnfNo4mb3Oog_frZg', name: 'A24', region: 'international' as const },
  { id: 'UCynfGRBFmWjZ3g62OBVIzVQ', name: 'Netflix', region: 'international' as const },
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

// 채널의 업로드 재생목록 ID = UC를 UU로 변경
function getUploadsPlaylistId(channelId: string): string {
  return 'UU' + channelId.substring(2);
}

const excludeWords = ['리뷰', 'review', '30초', '15초', 'shorts', 'highlight', '하이라이트',
  'behind', '비하인드', 'making', '메이킹', 'reaction', '리액션', 'interview', '인터뷰',
  'recap', '요약', 'explain', '해설', 'character', '캐릭터', '본편', '무삭제', 'deleted',
  'scene', '선공개', 'sneak', 'peek', 'opening', '엔딩', 'ending', 'ost', '뮤직비디오',
  'music video', '명장면', '스페셜', 'featurette', 'clip', 'teaser', '티저'];

function isTrailerTitle(title: string): boolean {
  const lower = title.toLowerCase();
  const isTrailer = lower.includes('trailer') || lower.includes('예고편') || lower.includes('예고');
  const isExcluded = excludeWords.some(w => lower.includes(w));
  return isTrailer && !isExcluded;
}

// playlistItems API 사용 (1유닛) — search API (100유닛)보다 훨씬 절약
async function fetchChannelTrailers(channel: typeof CHANNELS[0]): Promise<Trailer[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const playlistId = getUploadsPlaylistId(channel.id);
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId,
      maxResults: '30',
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
            .replace(/\s*메인 예고편.*/i, '')
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

  // youtubeId 기준 중복 제거
  const seen = new Set<string>();
  return all.filter(t => {
    if (seen.has(t.youtubeId)) return false;
    seen.add(t.youtubeId);
    return true;
  });
}
