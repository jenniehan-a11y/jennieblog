import { fetchAllTrailers } from '@/lib/api/tmdb';
import TrailerExplorer from '@/components/TrailerExplorer';

export const revalidate = 86400;

export default async function Home() {
  let trailers: Awaited<ReturnType<typeof fetchAllTrailers>> = [];

  try {
    trailers = await fetchAllTrailers();
  } catch (error) {
    console.error('Failed to fetch trailers:', error);
  }

  return (
    <div className="max-w-[1440px] mx-auto pt-6 pb-20">
      {trailers.length === 0 ? (
        <div className="text-center py-32 px-6">
          <p className="text-white/30 text-lg">예고편 데이터를 불러오지 못했습니다</p>
          <p className="text-white/15 text-sm mt-2">.env.local에 TMDB_API_KEY를 추가해주세요</p>
        </div>
      ) : (
        <TrailerExplorer initialTrailers={trailers} />
      )}
    </div>
  );
}
