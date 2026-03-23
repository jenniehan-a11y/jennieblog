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

// 장르별 그룹핑
const GENRE_SECTIONS = [
  { key: '액션', label: '액션' },
  { key: '스릴러', label: '스릴러' },
  { key: '공포', label: '공포' },
  { key: 'SF', label: 'SF' },
  { key: '로맨스', label: '로맨스' },
  { key: '드라마', label: '드라마' },
  { key: '코미디', label: '코미디' },
  { key: '범죄', label: '범죄' },
  { key: '판타지', label: '판타지' },
  { key: '미스터리', label: '미스터리' },
  { key: '모험', label: '모험' },
];

type Tab = 'all' | 'domestic' | 'international';

export default function TrailerExplorer({ initialTrailers }: TrailerExplorerProps) {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [heroModal, setHeroModal] = useState<Trailer | null>(null);

  const filtered = useMemo(() => {
    let list = initialTrailers;
    if (tab === 'domestic') list = list.filter(t => t.region === 'domestic');
    if (tab === 'international') list = list.filter(t => t.region === 'international');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.titleOriginal.toLowerCase().includes(q));
    }
    return list;
  }, [initialTrailers, tab, search]);

  // 최신 예고편 (히어로용)
  const hero = filtered[0];
  const heroCountry = hero ? getCountryInfo(hero.country) : null;

  // 장르별 분류
  const genreSections = useMemo(() => {
    return GENRE_SECTIONS.map(({ key, label }) => ({
      label,
      trailers: filtered.filter(t => t.genres.includes(key)).slice(0, 20),
    })).filter(s => s.trailers.length > 0);
  }, [filtered]);

  // 국내/해외 탭
  const tabs: { value: Tab; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'domestic', label: '국내' },
    { value: 'international', label: '해외' },
  ];

  return (
    <div className="space-y-12">
      {/* 네비게이션 */}
      <div className="flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-8">
          {tabs.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`text-sm font-semibold tracking-[-0.01em] transition-colors pb-1 border-b-2 ${
                tab === t.value
                  ? 'text-white border-white'
                  : 'text-white/25 border-transparent hover:text-white/50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <input type="text" placeholder="검색" value={search} onChange={e => setSearch(e.target.value)}
            className="w-48 bg-white/5 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-white/5 focus:border-white/15 focus:outline-none placeholder-white/15 transition-colors" />
          <svg className="w-4 h-4 text-white/15 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 히어로 */}
      {hero && !search && (
        <div className="px-6 lg:px-10">
          <div
            className="relative h-[380px] md:h-[480px] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setHeroModal(hero)}
          >
            <Image
              src={`https://img.youtube.com/vi/${hero.youtubeId}/maxresdefault.jpg`}
              alt={hero.title}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.02]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

            {/* 재생 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* 정보 */}
            <div className="absolute bottom-0 left-0 p-8 md:p-10 max-w-xl">
              <p className="text-white/40 text-xs font-medium uppercase tracking-[0.15em] mb-3">최신 예고편</p>
              <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.1]">
                {hero.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-white/40 text-sm">{heroCountry?.flag} {hero.year}</span>
                {hero.genres.slice(0, 3).map(g => (
                  <span key={g} className="px-2.5 py-0.5 rounded-full border border-white/15 text-white/40 text-xs">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 장르별 섹션 */}
      {search ? (
        // 검색 결과: 그리드
        <div className="px-6 lg:px-10">
          <p className="text-white/30 text-sm mb-6">&ldquo;{search}&rdquo; 검색 결과 · {filtered.length}개</p>
          <TrailerRow title="" trailers={filtered.slice(0, 40)} />
        </div>
      ) : (
        genreSections.map(section => (
          <TrailerRow key={section.label} title={section.label} trailers={section.trailers} />
        ))
      )}

      {/* 분류 안 된 최신 예고편 */}
      {!search && (
        <TrailerRow
          title="최신 예고편"
          trailers={filtered.slice(0, 20)}
        />
      )}

      {heroModal && <TrailerModal trailer={heroModal} onClose={() => setHeroModal(null)} />}
    </div>
  );
}
