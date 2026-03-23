'use client';

import { useRef, useState } from 'react';
import { Trailer } from '@/types/trailer';
import TrailerCard from './TrailerCard';
import TrailerModal from './TrailerModal';

interface TrailerRowProps {
  title: string;
  trailers: Trailer[];
  showDate?: boolean;
}

export default function TrailerRow({ title, trailers, showDate = false }: TrailerRowProps) {
  const [selected, setSelected] = useState<Trailer | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (trailers.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className="space-y-5 pt-4">
      {/* 제목 + 화살표 */}
      <div className="flex items-center gap-4 px-6 lg:px-10">
        <h2 className="text-black text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.04em] uppercase leading-[0.9]">
          {title}
        </h2>
        <div className="flex gap-1 ml-3">
          <button onClick={() => scroll('left')}
            className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-black/40">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scroll('right')}
            className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-black/40">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 카루셀 */}
      <div ref={scrollRef} className="scroll-row px-6 lg:px-10">
        {trailers.map((t) => (
          <div key={t.id} className="w-[calc(25%-12px)] min-w-[260px]">
            <TrailerCard trailer={t} onPlay={setSelected} showDate={showDate} />
          </div>
        ))}
      </div>

      {selected && <TrailerModal trailer={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
