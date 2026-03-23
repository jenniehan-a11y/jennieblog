'use client';

import Image from 'next/image';
import { Trailer } from '@/types/trailer';

interface TrailerCardProps {
  trailer: Trailer;
  onPlay: (trailer: Trailer) => void;
}

export default function TrailerCard({ trailer, onPlay }: TrailerCardProps) {
  return (
    <div className="group cursor-pointer" onClick={() => onPlay(trailer)}>
      <div className="relative aspect-video overflow-hidden bg-black/5">
        <Image
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fill
          className="object-cover transition-all duration-500 group-hover:opacity-80"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-black/80 line-clamp-1">
        {trailer.title}
      </p>
    </div>
  );
}
