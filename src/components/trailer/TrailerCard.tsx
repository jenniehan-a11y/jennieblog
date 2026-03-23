'use client';

import Image from 'next/image';
import { Trailer } from '@/types/trailer';

interface TrailerCardProps {
  trailer: Trailer;
  onPlay: (trailer: Trailer) => void;
  showDate?: boolean;
}

export default function TrailerCard({ trailer, onPlay, showDate = false }: TrailerCardProps) {
  return (
    <div className="group cursor-pointer" onClick={() => onPlay(trailer)}>
      {/* 썸네일 */}
      <div className="relative aspect-video rounded-md overflow-hidden bg-black/5">
        <Image
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* 호버: Play Trailer */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.08em] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-xl">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Trailer
          </span>
        </div>
      </div>

      {/* 제목 */}
      <h3 className="mt-2.5 text-black text-[13px] font-bold uppercase tracking-[-0.01em] line-clamp-1">
        {trailer.title}
      </h3>
      {showDate && trailer.releaseDate && (
        <p className="text-black/30 text-[11px] mt-0.5 uppercase tracking-[0.03em]">
          {new Date(trailer.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </div>
  );
}
