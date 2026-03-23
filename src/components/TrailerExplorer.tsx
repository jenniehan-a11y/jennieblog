'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Trailer } from '@/types/trailer';
import { getCountryInfo } from '@/lib/data/countries';
import TrailerRow from './trailer/TrailerRow';
import TrailerModal from './trailer/TrailerModal';

interface TrailerExplorerProps {
  initialTrailers: Trailer[];
}

const GENRES = ['액션', '스릴러', '공포', 'SF', '로맨스', '드라마', '코미디', '범죄', '판타지', '미스터리', '모험'];

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [heroModal, setHeroModal] = useState<Trailer | null>(null);

  // 최신순 정렬된 전체 목록
  const all = initialTrailers;

  // 히어로: 최신 1개
  const hero = all[0];
  const heroCountry = hero ? getCountryInfo(hero.country) : null;

  // 카테고리별
  const now = all.slice(0, 15); // 최신 예고편
  const upcoming = useMemo(() => all.filter(t => {
    if (!t.releaseDate) return false;
    return new Date(t.releaseDate) > new Date();
  }).slice(0, 15), [all]);

  const domestic = useMemo(() => all.filter(t => t.region === 'domestic').slice(0, 15), [all]);
  const international = useMemo(() => all.filter(t => t.region === 'international').slice(0, 15), [all]);

  // 장르별
  const genreSections = useMemo(() =>
    GENRES.map(g => ({
      label: g,
      trailers: all.filter(t => t.genres.includes(g)).slice(0, 15),
    })).filter(s => s.trailers.length >= 3),
  [all]);

  return (
    <div className="space-y-16">
      {/* 히어로 */}
      {hero && (
        <section className="px-6 lg:px-10">
          <div
            className="relative h-[50vh] md:h-[65vh] rounded-sm overflow-hidden cursor-pointer group"
            onClick={() => setHeroModal(hero)}
          >
            <Image
              src={`https://img.youtube.com/vi/${hero.youtubeId}/maxresdefault.jpg`}
              alt={hero.title}
              fill
              className="object-cover transition-all duration-[2s] ease-out group-hover:scale-[1.02] group-hover:brightness-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Play Trailer */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-[0.05em] rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Trailer
                </span>
              </div>
            </div>

            {/* 정보 */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <h1 className="text-white text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.95] uppercase">
                {hero.title}
              </h1>
              <div className="flex items-center gap-3 mt-4 text-xs text-white/40 uppercase tracking-[0.1em] font-semibold">
                <span>{heroCountry?.flag} {heroCountry?.name}</span>
                <span>·</span>
                <span>{hero.year}</span>
                {hero.genres.slice(0, 2).map(g => (
                  <span key={g} className="px-2.5 py-0.5 border border-white/20 rounded-full text-white/50">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Now */}
      <TrailerRow id="now" title="Now" trailers={now} size="large" />

      {/* Coming Soon */}
      {upcoming.length > 0 && (
        <TrailerRow id="coming" title="Coming Soon" trailers={upcoming} size="medium" showDate />
      )}

      {/* 국내 */}
      <TrailerRow title="Korea" trailers={domestic} size="medium" />

      {/* 해외 */}
      <TrailerRow title="International" trailers={international} size="medium" />

      {/* 장르별 */}
      <div id="genres" className="space-y-14">
        {genreSections.map(section => (
          <TrailerRow key={section.label} title={section.label} trailers={section.trailers} size="small" />
        ))}
      </div>

      {heroModal && <TrailerModal trailer={heroModal} onClose={() => setHeroModal(null)} />}
    </div>
  );
}
