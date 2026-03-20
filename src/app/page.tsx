import { fetchAllTrailers } from '@/lib/api/tmdb';
import TrailerExplorer from '@/components/TrailerExplorer';

export const revalidate = 86400; // 24시간마다 갱신

export default async function Home() {
  let trailers: Awaited<ReturnType<typeof fetchAllTrailers>> = [];

  try {
    trailers = await fetchAllTrailers();
  } catch (error) {
    console.error('Failed to fetch trailers:', error);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-8 pt-20 pb-20">
      {trailers.length === 0 ? (
        <div className="text-center py-32">
          <h1 className="text-3xl font-bold text-[#f5f5f7] mb-4">🎬 Jennie Trailer</h1>
          <p className="text-[#86868b] mb-2">
            예고편 데이터를 불러오지 못했습니다.
          </p>
          <p className="text-[#48484a] text-sm mt-4">
            .env.local 파일에 TMDB_API_KEY를 추가해주세요
          </p>
        </div>
      ) : (
        <TrailerExplorer initialTrailers={trailers} />
      )}
    </div>
  );
}
