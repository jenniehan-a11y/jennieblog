import { Trailer } from '@/types/trailer';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

// 공식 유튜브 채널
const CHANNELS = [
  // 해외 먼저 (해외 콘텐츠는 영어 버전 우선)
  { id: 'UCWOA1ZGywLbqmigxE4Qlvuw', name: 'Netflix', region: 'international' as const },
  { id: 'UCpiCK8c6PBktcxq7Az_t4RQ', name: 'Netflix K-Content', region: 'domestic' as const },
  { id: 'UCjmJDM5pRKbUlVIzDYYWb6g', name: 'Warner Bros', region: 'international' as const },
  { id: 'UCq0OueAsdxH6b8nyAspwViw', name: 'Universal Pictures', region: 'international' as const },
  { id: 'UCuPivVjnfNo4mb3Oog_frZg', name: 'A24', region: 'international' as const },
  { id: 'UC_IRYSp4auq7hKLiRDGSzgg', name: 'Walt Disney Studios', region: 'international' as const },
  { id: 'UCnc6db-y3IU7CkT_yeVXdVg', name: 'Sony Pictures', region: 'international' as const },
  { id: 'UC2-BeLxzUBSs0uSrmzWhJuQ', name: '20th Century Studios', region: 'international' as const },
  { id: 'UCnIup-Jnwr6emLxO8McEhSw', name: 'Paramount Pictures', region: 'international' as const },
  { id: 'UCi8e0iOVk1fEOogdfu4YgfA', name: 'Lionsgate Movies', region: 'international' as const },
  { id: 'UCF9imwPMSGz4hkMKLFsFmvg', name: 'Focus Features', region: 'international' as const },
  { id: 'UCgwv23FVv3lqh567yagM9IQ', name: 'Searchlight Pictures', region: 'international' as const },
  { id: 'UCx-KWLTKlB83hDI6UKECtJQ', name: 'HBO Max', region: 'international' as const },
  // 한국 OTT/방송사 (넷플릭스 코리아는 글로벌과 중복되므로 제외, 한국 오리지널은 TMDB에서)
  { id: 'UCjn-VbcIkAeXQKCmLJV8YwQ', name: '쿠팡플레이', region: 'domestic' as const },
  { id: 'UC9w-h_ciMmX64TcLRcb1xPg', name: 'tvN DRAMA', region: 'domestic' as const },
  { id: 'UCNIiH_4ArJNd_cDZApZ7AFg', name: '티빙', region: 'domestic' as const },
  { id: 'UCbv7Dcn5iNrAyd3GwgVHkIQ', name: 'Disney Korea', region: 'domestic' as const },
  { id: 'UCtdz9LWNNQKUg4Xpma_40Ug', name: '디즈니+ 코리아', region: 'domestic' as const },
  { id: 'UCqMxSHOEbn-f5nVCuDW5YbA', name: '웨이브', region: 'domestic' as const },
  { id: 'UCkbJc8jMcTXwhtmN5VMwfXg', name: 'JTBC Drama', region: 'domestic' as const },
  { id: 'UCcOYEm78CpaZQvPE6LtoSeA', name: 'SBS', region: 'domestic' as const },
  { id: 'UCaKod3X1Tn4c7Ci0iUKcvzQ', name: '왓챠', region: 'domestic' as const },
  { id: 'UCFZPGgRaOs9j9BNXXQvVawA', name: '스튜디오지니', region: 'domestic' as const },
  { id: 'UCXmRJfZ3atLVLDiO5Ufycvw', name: '스튜디오지니', region: 'domestic' as const },
  { id: 'UCw0LjEsFRJCM0aIUZlYFHBQ', name: 'CJ ENM', region: 'domestic' as const },
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
  // 공연/콘서트/뮤지컬
  '공연', '콘서트', 'concert', '뮤지컬', 'musical', '내한', '페스티벌', 'festival',
  '팬미팅', 'fan meeting', '라이브', 'live performance',
  // 예능
  '예능', 'variety', '관찰카메라', '나혼자산다', '놀면뭐하니', '런닝맨',
  '나혼자', '프린스', '건물주', '대탈출', '신서유기', '게임쇼', '토크쇼', '쇼미더머니', 'show me the money',
  // 회차별 예고 (에피소드 예고)
  '회 예고', '화 예고', '회예고', '화예고', '회 예고편', '화 예고편',
  // 숏폼/클립 (해시태그로 시작하는 짧은 클립)
  // 특별 발표/이벤트/기념
  'special announcement', '기념', 'anniversary', '20주년', '10주년',
  // 스페셜 (기념 스페셜, 스페셜 티저 등)
  '스페셜',
  // 교양/다큐/시사
  '궁금한 이야기', '그것이 알고싶다', '그것이 알고 싶다', '다큐', 'documentary', '시사',
  // 홍보/안내 영상
  'what\'s next', 'watch the trailer',
  // 스팟/세로형 영상
  'spot', '스팟', '#shorts', 'vertical',
  // 게임
  'game trailer', 'gameplay', '게임',
  // 기타
  'featurette',
];

// 예능 관련 제외 키워드 (넷플릭스는 예외)
const varietyWords = ['예능', 'variety', '관찰카메라', '나혼자산다', '놀면뭐하니', '런닝맨'];

function isTrailerTitle(title: string, channelName: string): boolean {
  const lower = title.toLowerCase();

  // SBS: 드라마 예고편만 허용
  if (channelName === 'SBS') {
    return (lower.includes('드라마') || lower.includes('drama'))
      && (lower.includes('예고') || lower.includes('티저') || lower.includes('trailer') || lower.includes('teaser'));
  }

  // 해시태그 클립 제외 (숏폼)
  if (title.includes('#') && !lower.includes('trailer') && !lower.includes('예고편')) return false;

  // 회차/날짜별 예고 제외: "3회 예고", "9화 예고", "3월 29일 예고" 등
  if (/\d+회\s*예고|\d+화\s*예고|\d+월\s*\d+일\s*예고/.test(title)) return false;

  // 예고편 관련 키워드
  const isTrailer = lower.includes('trailer') || lower.includes('예고편') || lower.includes('예고')
    || lower.includes('공식 발표') || lower.includes('announcement')
    || lower.includes('티저') || lower.includes('teaser')
    || lower.includes('coming soon');
  if (!isTrailer) return false;

  // 제외 목록 체크 (넷플릭스는 예능 허용)
  const isNetflix = channelName.includes('Netflix');
  const activeExcludes = isNetflix
    ? excludeWords.filter(w => !varietyWords.includes(w))
    : excludeWords;
  const isExcluded = activeExcludes.some(w => lower.includes(w));
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
      next: { revalidate: 21600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items: YouTubePlaylistItem[] = data.items || [];

    return items
      .filter(item => isTrailerTitle(item.snippet.title, channel.name))
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
