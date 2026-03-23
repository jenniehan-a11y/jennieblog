'use client';

import Image from 'next/image';
import { Trailer } from '@/types/trailer';

interface TrailerCardProps {
  trailer: Trailer;
  onPlay: (trailer: Trailer) => void;
  size?: 'large' | 'medium' | 'small';
  showDate?: boolean;
}

export default function TrailerCard({ trailer, onPlay, size = 'medium', showDate = false }: TrailerCardProps) {
  const widthClass = size === 'large' ? 'w-[400px] md:w-[500px]' : size === 'small' ? 'w-[200px] md:w-[240px]' : 'w-[280px] md:w-[320px]';

  return (
    <div className={`${widthClass} group cursor-pointer`} onClick={() => onPlay(trailer)}>
      {/* 포스터 */}
      <div className="relative aspect-video rounded-sm overflow-hidden bg-white/5">
        <Image
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-75"
          sizes={size === 'large' ? '500px' : size === 'small' ? '240px' : '320px'}
        />

        {/* Play Trailer 버튼 */}
        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-[0.05em] rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Trailer
          </span>
        </div>
      </div>

      {/* 정보 */}
      <div className="mt-3">
        <h3 className="text-white text-sm font-bold tracking-[-0.01em] line-clamp-1 group-hover:text-white/70 transition-colors">
          {trailer.title}
        </h3>
        {showDate && trailer.releaseDate && (
          <p className="text-white/30 text-xs mt-1 uppercase tracking-[0.05em]">
            {new Date(trailer.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}
