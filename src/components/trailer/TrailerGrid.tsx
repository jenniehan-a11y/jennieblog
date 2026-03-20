'use client';

import { useState } from 'react';
import { Trailer } from '@/types/trailer';
import TrailerCard from './TrailerCard';
import TrailerModal from './TrailerModal';

interface TrailerGridProps {
  trailers: Trailer[];
  onToggleFavorite?: (id: string) => void;
}

const ITEMS_PER_PAGE = 24;

export default function TrailerGrid({ trailers, onToggleFavorite }: TrailerGridProps) {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(trailers.length / ITEMS_PER_PAGE);
  const paginatedTrailers = trailers.slice(0, page * ITEMS_PER_PAGE);

  if (trailers.length === 0) {
    return (
      <div className="text-center py-32">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-white/30 text-[15px] font-medium">결과 없음</p>
        <p className="text-white/15 text-[13px] mt-1">필터를 조정해보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {paginatedTrailers.map((trailer) => (
          <TrailerCard
            key={trailer.id}
            trailer={trailer}
            onPlay={setSelectedTrailer}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="text-center mt-14">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="group px-8 py-2.5 text-[13px] font-medium text-white/40 hover:text-white/70 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200"
          >
            더 보기
            <span className="text-white/15 ml-2 group-hover:text-white/30 transition-colors">
              +{trailers.length - paginatedTrailers.length}
            </span>
          </button>
        </div>
      )}

      {selectedTrailer && (
        <TrailerModal
          trailer={selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
        />
      )}
    </>
  );
}
