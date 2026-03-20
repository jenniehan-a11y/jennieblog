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
        <p className="text-[#86868b] text-lg">조건에 맞는 예고편이 없습니다</p>
        <p className="text-[#48484a] text-sm mt-2">필터를 조정해보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
        {paginatedTrailers.map((trailer) => (
          <TrailerCard
            key={trailer.id}
            trailer={trailer}
            onPlay={setSelectedTrailer}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* 더 보기 */}
      {page < totalPages && (
        <div className="text-center mt-12">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-8 py-3 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f5f5f7] text-sm font-medium rounded-full transition-all border border-[#38383a] hover:border-[#48484a]"
          >
            더 보기
          </button>
        </div>
      )}

      {/* 모달 */}
      {selectedTrailer && (
        <TrailerModal
          trailer={selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
        />
      )}
    </>
  );
}
