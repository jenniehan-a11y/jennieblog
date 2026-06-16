import { fetchAllTrailers, getTop10ByViews } from '@/lib/api/tmdb';
import TrailerExplorer from '@/components/TrailerExplorer';
import { Trailer } from '@/types/trailer';

export const revalidate = 21600; // 6시간마다 자동 업데이트

async function loadData(): Promise<{
  trailers: Trailer[];
  top10Korea: Trailer[];
  top10Intl: Trailer[];
}> {
  try {
    const trailers = await fetchAllTrailers();
    return {
      trailers,
      top10Korea: getTop10ByViews(trailers, 30, 'domestic'),
      top10Intl: getTop10ByViews(trailers, 30, 'international'),
    };
  } catch (error) {
    console.error('Failed to fetch trailers:', error);
    return { trailers: [], top10Korea: [], top10Intl: [] };
  }
}

export default async function Home() {
  const { trailers, top10Korea, top10Intl } = await loadData();

  return trailers.length === 0 ? (
    <div className="text-center py-32 px-6">
      <p className="text-black/30 text-lg font-bold uppercase tracking-[0.1em]">No Trailers</p>
      <p className="text-black/15 text-sm mt-2">TMDB_API_KEY를 설정해주세요</p>
    </div>
  ) : (
    <TrailerExplorer
      initialTrailers={trailers}
      top10Korea={top10Korea}
      top10Intl={top10Intl}
    />
  );
}
