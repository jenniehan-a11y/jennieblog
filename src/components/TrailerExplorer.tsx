'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Trailer } from '@/types/trailer';
import TrailerRow from './trailer/TrailerRow';
import TrailerCard from './trailer/TrailerCard';
import TrailerModal from './trailer/TrailerModal';

interface TrailerExplorerProps {
  initialTrailers: Trailer[];
}

const GENRES = [
  { ko: '액션', en: 'Action' },
  { ko: '스릴러', en: 'Thriller' },
  { ko: '공포', en: 'Horror' },
  { ko: 'SF', en: 'Sci-Fi' },
  { ko: '로맨스', en: 'Romance' },
  { ko: '드라마', en: 'Drama' },
  { ko: '코미디', en: 'Comedy' },
  { ko: '범죄', en: 'Crime' },
  { ko: '판타지', en: 'Fantasy' },
  { ko: '미스터리', en: 'Mystery' },
];

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [heroModal, setHeroModal] = useState<Trailer | null>(null);
  const [gridModal, setGridModal] = useState<Trailer | null>(null);

  const all = initialTrailers;
  const hero = all[0];

  const upcoming = useMemo(() => all.filter(t => {
    if (!t.releaseDate) return false;
    return new Date(t.releaseDate) > new Date();
  }).slice(0, 15), [all]);

  const domestic = useMemo(() => all.filter(t => t.region === 'domestic').slice(0, 15), [all]);
  const international = useMemo(() => all.filter(t => t.region === 'international').slice(0, 15), [all]);

  const genreSections = useMemo(() =>
    GENRES.map(g => ({
      label: g.en,
      trailers: all.filter(t => t.genres.includes(g.ko)).slice(0, 15),
    })).filter(s => s.trailers.length >= 3),
  [all]);

  return (
    <div className="space-y-28">
      {/* 히어로: WATCH NOW 스타일 */}
      {hero && (
        <section className="px-6 lg:px-10">
          {/* 큰 타이틀 */}
          <h1 className="text-black text-[clamp(2.5rem,6vw,5rem)] font-black tracking-[-0.05em] uppercase leading-[0.9] mb-8">
            Watch Now
          </h1>

          {/* 히어로 카드: 자동재생 */}
          <div className="relative aspect-video rounded-md overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${hero.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${hero.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media"
              className="absolute inset-0 w-full h-full pointer-events-none"
              title={hero.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* 제목 오버레이 */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10 z-10">
              <h2 className="text-white text-[clamp(2rem,5vw,4.5rem)] font-black tracking-[-0.05em] uppercase leading-[0.9] drop-shadow-lg">
                {hero.title}
              </h2>
              <p className="text-white/50 text-xs uppercase tracking-[0.1em] font-semibold mt-2">
                {hero.year} · {hero.genres.slice(0, 2).join(' · ')}
              </p>
            </div>

            {/* Play 버튼 */}
            <button
              onClick={() => setHeroModal(hero)}
              className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.08em] rounded-full shadow-xl hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Full Trailer
            </button>
          </div>
        </section>
      )}

      {/* ALL FILMS: 4열 그리드 */}
      <section className="px-6 lg:px-10">
        <h2 className="text-black text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.05em] uppercase leading-[0.9] mb-8">
          All Trailers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {all.slice(0, 16).map(t => (
            <TrailerCard key={t.id} trailer={t} onPlay={setGridModal} />
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      {upcoming.length > 0 && (
        <TrailerRow title="Coming Soon" trailers={upcoming} showDate />
      )}

      {/* 국내 */}
      <TrailerRow title="Korea" trailers={domestic} />

      {/* 해외 */}
      <TrailerRow title="International" trailers={international} />

      {/* 장르별 */}
      {genreSections.map(section => (
        <TrailerRow key={section.label} title={section.label} trailers={section.trailers} />
      ))}

      {heroModal && <TrailerModal trailer={heroModal} onClose={() => setHeroModal(null)} />}
      {gridModal && <TrailerModal trailer={gridModal} onClose={() => setGridModal(null)} />}
    </div>
  );
}
