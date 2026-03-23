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

  return trailers.length === 0 ? (
    <div className="text-center py-32 px-6">
      <p className="text-white/30 text-lg font-bold uppercase tracking-[0.1em]">No Trailers</p>
      <p className="text-white/15 text-sm mt-2">TMDB_API_KEY를 설정해주세요</p>
    </div>
  ) : (
    <div className="pt-6 pb-24">
      <TrailerExplorer initialTrailers={trailers} />
    </div>
  );
}
