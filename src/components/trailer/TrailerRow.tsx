'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trailer } from '@/types/trailer';
import { getCountryInfo } from '@/lib/data/countries';
import TrailerModal from './TrailerModal';

interface TrailerRowProps {
  title: string;
  trailers: Trailer[];
}

export default function TrailerRow({ title, trailers }: TrailerRowProps) {
  const [selected, setSelected] = useState<Trailer | null>(null);

  if (trailers.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between px-6 lg:px-10">
        <h2 className="text-white text-xl font-bold tracking-[-0.03em]">{title}</h2>
        <span className="text-white/20 text-xs font-medium">{trailers.length}</span>
      </div>

      <div className="scroll-row px-6 lg:px-10">
        {trailers.map((t) => {
          const country = getCountryInfo(t.country);
          return (
            <div
              key={t.id}
              className="group w-[300px] md:w-[340px] cursor-pointer"
              onClick={() => setSelected(t)}
            >
              {/* 썸네일 */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                <Image
                  src={t.thumbnailUrl}
                  alt={t.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="340px"
                />
                {/* 호버 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 정보 */}
              <div className="mt-2.5">
                <h3 className="text-white text-sm font-semibold line-clamp-1 tracking-[-0.01em] group-hover:text-white/80 transition-colors">
                  {t.title}
                </h3>
                <p className="text-white/30 text-xs mt-0.5 flex items-center gap-1">
                  <span>{country.flag}</span>
                  <span>{t.year}</span>
                  {t.genres[0] && <><span className="text-white/10">·</span><span>{t.genres[0]}</span></>}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <TrailerModal trailer={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
