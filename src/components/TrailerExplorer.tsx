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

const GENRES = ['액션', '스릴러', '공포', 'SF', '로맨스', '드라마', '코미디', '범죄', '판타지', '미스터리'];

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
      label: g,
      trailers: all.filter(t => t.genres.includes(g)).slice(0, 15),
    })).filter(s => s.trailers.length >= 3),
  [all]);

  return (
    <div className="space-y-20">
      {/* 히어로: WATCH NOW 스타일 */}
      {hero && (
        <section className="px-6 lg:px-10">
          {/* 큰 타이틀 */}
          <h1 className="text-black text-[clamp(3rem,10vw,8rem)] font-black tracking-[-0.06em] uppercase leading-[0.85] mb-8">
            Watch<br />Now
          </h1>

          {/* 히어로 카드 */}
          <div
            className="relative aspect-[21/9] rounded-md overflow-hidden cursor-pointer group"
            onClick={() => setHeroModal(hero)}
          >
            <Image
              src={`https://img.youtube.com/vi/${hero.youtubeId}/maxresdefault.jpg`}
              alt={hero.title}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.02]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* 제목 오버레이 */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <h2 className="text-white text-[clamp(2rem,5vw,4.5rem)] font-black tracking-[-0.05em] uppercase leading-[0.9] drop-shadow-lg">
                {hero.title}
              </h2>
              <p className="text-white/50 text-xs uppercase tracking-[0.1em] font-semibold mt-2">
                {hero.year} · {hero.genres.slice(0, 2).join(' · ')}
              </p>
            </div>

            {/* Play 버튼 */}
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.08em] rounded-full shadow-xl">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Trailer
              </span>
            </div>
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
