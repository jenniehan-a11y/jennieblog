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
  const typeLabel = CONTENT_TYPE_LABELS[trailer.contentType] || trailer.contentType;

  return (
    <div className="group relative">
      {/* 썸네일 */}
      <div
        className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#1a1a1a] shadow-lg shadow-black/50"
        onClick={() => onPlay(trailer)}
      >
        <Image
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* 재생 버튼 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* 플랫폼 뱃지 */}
        {trailer.platform && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] text-white/90 font-medium tracking-wide">
            {trailer.platform}
          </div>
        )}

        {/* 즐겨찾기 */}
        {onToggleFavorite && trailer.isFavorite && (
          <div className="absolute top-3 right-3">
            <span className="text-sm">⭐</span>
          </div>
        )}

        {/* 하단 정보 (호버 시) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-semibold text-[15px] leading-tight drop-shadow-lg">
            {trailer.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-white/70">
            <span>{country.flag}</span>
            <span>{typeLabel}</span>
            <span className="text-white/30">·</span>
            <span>{trailer.year}</span>
            {trailer.genres[0] && (
              <>
                <span className="text-white/30">·</span>
                <span>{trailer.genres[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 썸네일 아래 제목 (항상 보임) */}
      <div className="mt-3 px-1">
        <h3 className="text-[#f5f5f7] font-medium text-[14px] line-clamp-1 group-hover:text-white transition-colors">
          {trailer.title}
        </h3>
        <p className="text-[#86868b] text-[12px] mt-0.5">
          {typeLabel} · {trailer.year}
          {trailer.platform && <span> · {trailer.platform}</span>}
        </p>
      </div>
    </div>
  );
}
