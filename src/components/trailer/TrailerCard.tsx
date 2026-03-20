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
    <div className="group relative animate-fade-up">
      {/* 카드 */}
      <div
        className="relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer card-glow transition-all duration-500 bg-[#141414]"
        onClick={() => onPlay(trailer)}
      >
        <Image
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.08]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* 항상 보이는 하단 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />

        {/* 호버 시 전체 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

        {/* 재생 버튼 - 호버 시 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-xl">
            <svg className="w-5 h-5 text-[#0a0a0a] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* 좌상단 뱃지 */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {trailer.platform && (
            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-xl rounded-md text-[10px] text-white/90 font-medium border border-white/[0.08]">
              {trailer.platform}
            </span>
          )}
        </div>

        {/* 우상단 즐겨찾기 */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(trailer.id);
            }}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              trailer.isFavorite
                ? 'bg-amber-500/20 backdrop-blur-xl border border-amber-500/30'
                : 'bg-white/5 backdrop-blur-xl opacity-0 group-hover:opacity-100 border border-white/[0.08]'
            }`}
            aria-label="즐겨찾기"
          >
            <span className="text-[10px]">{trailer.isFavorite ? '⭐' : '☆'}</span>
          </button>
        )}

        {/* 하단 정보 - 항상 보임 */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-[13px] leading-snug line-clamp-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {trailer.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-white/50">
            <span>{country.flag}</span>
            <span>{typeLabel}</span>
            <span className="text-white/20">·</span>
            <span>{trailer.year}</span>
            {trailer.genres[0] && (
              <>
                <span className="text-white/20">·</span>
                <span>{trailer.genres[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
