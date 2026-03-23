'use client';

import { useState, useMemo } from 'react';
import { Trailer } from '@/types/trailer';
import Header from './layout/Header';
import TrailerCard from './trailer/TrailerCard';
import TrailerModal from './trailer/TrailerModal';

interface TrailerExplorerProps {
  initialTrailers: Trailer[];
}

const GENRE_LABELS: Record<string, string> = {
  '액션': 'Action', '스릴러': 'Thriller', '공포': 'Horror', 'SF': 'Sci-Fi',
  '로맨스': 'Romance', '드라마': 'Drama', '코미디': 'Comedy', '범죄': 'Crime',
  '판타지': 'Fantasy', '미스터리': 'Mystery', '애니메이션': 'Animation',
};

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [heroModal, setHeroModal] = useState<Trailer | null>(null);
  const [gridModal, setGridModal] = useState<Trailer | null>(null);
  const [filter, setFilter] = useState<{ genre?: string; region?: string } | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return initialTrailers;
    if (filter.genre === '애니메이션') {
      // 애니메이션 카테고리: 애니메이션 장르만
      return initialTrailers.filter(t => t.genres.includes('애니메이션'));
    }
    if (filter.genre) {
      // 다른 장르: 애니메이션 제외
      return initialTrailers.filter(t => t.genres.includes(filter.genre!) && !t.genres.includes('애니메이션'));
    }
    if (filter.region) return initialTrailers.filter(t => t.region === filter.region);
    return initialTrailers;
  }, [initialTrailers, filter]);

  const hero = initialTrailers[0];

  const activeLabel = filter?.genre
    ? GENRE_LABELS[filter.genre] || filter.genre
    : filter?.region === 'domestic' ? 'Korea'
    : filter?.region === 'international' ? 'International'
    : null;

  return (
    <>
      <Header onFilter={setFilter} />

      <div className="pt-10 pb-32 space-y-24">
        {/* 히어로: 자동재생 (필터 없을 때만) */}
        {!filter && hero && (
          <section>
            <div className="relative aspect-video overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${hero.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${hero.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                className="absolute inset-0 w-full h-full pointer-events-none"
                title={hero.title}
              />
              <button
                onClick={() => setHeroModal(hero)}
                className="absolute bottom-6 right-6 z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.08em] rounded-full shadow-xl hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Full Trailer
              </button>
            </div>
          </section>
        )}

        {/* All Trailers / 필터 결과 */}
        <section className="px-10 lg:px-20">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-black text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.04em] uppercase leading-[0.9]">
              {activeLabel || 'All Trailers'}
            </h2>
            <span className="text-black/20 text-sm font-medium">{filtered.length}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
            {filtered.map(t => (
              <TrailerCard key={t.id} trailer={t} onPlay={setGridModal} />
            ))}
          </div>
        </section>
      </div>

      {heroModal && <TrailerModal trailer={heroModal} onClose={() => setHeroModal(null)} />}
      {gridModal && <TrailerModal trailer={gridModal} onClose={() => setGridModal(null)} />}
    </>
  );
}
