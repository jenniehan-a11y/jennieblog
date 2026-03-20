'use client';

import { useState } from 'react';
import { Trailer } from '@/types/trailer';
import TrailerCard from './TrailerCard';
import TrailerModal from './TrailerModal';

interface TrailerGridProps {
  trailers: Trailer[];
  onToggleFavorite?: (id: string) => void;
}

export default function TrailerGrid({ trailers, onToggleFavorite }: TrailerGridProps) {
  const [selected, setSelected] = useState<Trailer | null>(null);
  const [count, setCount] = useState(24);

  const visible = trailers.slice(0, count);
  const hasMore = count < trailers.length;

  if (trailers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <p className="text-white/25 text-sm font-medium">결과가 없어요</p>
        <p className="text-white/10 text-xs mt-1">다른 필터를 선택해보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {visible.map((t, i) => (
          <div key={t.id} style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
            <TrailerCard trailer={t} onPlay={setSelected} onToggleFavorite={onToggleFavorite} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button onClick={() => setCount(c => c + 24)}
            className="px-6 py-2.5 text-[12px] font-medium text-white/25 hover:text-white/50 rounded-full border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] transition-all">
            더 보기 · {trailers.length - count}개 남음
          </button>
        </div>
      )}

      {selected && <TrailerModal trailer={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
