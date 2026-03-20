'use client';

import Image from 'next/image';
import { Trailer } from '@/types/trailer';
import { getCountryInfo } from '@/lib/data/countries';
import { CONTENT_TYPE_LABELS } from '@/lib/data/tags';

interface TrailerCardProps {
  trailer: Trailer;
  onPlay: (trailer: Trailer) => void;
  onToggleFavorite?: (id: string) => void;
}

export default function TrailerCard({ trailer, onPlay, onToggleFavorite }: TrailerCardProps) {
  const country = getCountryInfo(trailer.country);
  const typeLabel = CONTENT_TYPE_LABELS[trailer.contentType] || '';

  return (
    <div className="group fade-in">
      <div
        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#111] ring-1 ring-white/[0.04] hover:ring-white/[0.08] transition-all duration-500"
        onClick={() => onPlay(trailer)}
      >
        <Image
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* 상시 하단 그라데이션 */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 재생 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="w-[52px] h-[52px] rounded-full backdrop-blur-xl bg-white/15 border border-white/20 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-400 shadow-2xl">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* 뱃지: 플랫폼 */}
        {trailer.platform && (
          <div className="absolute top-3 left-3 px-2 py-[3px] rounded-md bg-black/50 backdrop-blur-md border border-white/[0.06] text-[10px] text-white/80 font-medium">
            {trailer.platform}
          </div>
        )}

        {/* 즐겨찾기 */}
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(trailer.id); }}
            className={`absolute top-3 right-3 w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
              trailer.isFavorite
                ? 'bg-amber-500/20 border-amber-400/30 opacity-100'
                : 'bg-black/30 border-white/[0.06] opacity-0 group-hover:opacity-100'
            }`}>
            <span className="text-[11px]">{trailer.isFavorite ? '★' : '☆'}</span>
          </button>
        )}

        {/* 하단 정보 */}
        <div className="absolute bottom-0 inset-x-0 p-3.5">
          <h3 className="text-white font-semibold text-[13px] leading-[1.3] line-clamp-1 tracking-[-0.01em]">
            {trailer.title}
          </h3>
          <p className="text-white/40 text-[11px] mt-1 flex items-center gap-1">
            <span>{country.flag}</span>
            <span>{typeLabel}</span>
            <span className="text-white/15">·</span>
            <span>{trailer.year}</span>
            {trailer.genres[0] && (
              <>
                <span className="text-white/15">·</span>
                <span>{trailer.genres[0]}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
