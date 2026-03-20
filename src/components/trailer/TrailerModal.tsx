'use client';

import { useEffect } from 'react';
import { Trailer } from '@/types/trailer';
import { getCountryInfo } from '@/lib/data/countries';
import { CONTENT_TYPE_LABELS, TRAILER_TYPE_LABELS } from '@/lib/data/tags';
import YouTubePlayer from './YouTubePlayer';

interface TrailerModalProps {
  trailer: Trailer;
  onClose: () => void;
}

export default function TrailerModal({ trailer, onClose }: TrailerModalProps) {
  const country = getCountryInfo(trailer.country);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl mx-4 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <div className="flex justify-end mb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors"
            aria-label="닫기"
          >
            <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 영상 */}
        <div className="rounded-2xl overflow-hidden">
          <YouTubePlayer youtubeId={trailer.youtubeId} autoplay />
        </div>

        {/* 정보 */}
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-[#f5f5f7] text-2xl font-bold tracking-tight">{trailer.title}</h2>
            {trailer.titleOriginal !== trailer.title && (
              <p className="text-[#86868b] text-sm mt-1">{trailer.titleOriginal}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-[#1c1c1e] text-[#f5f5f7] text-sm rounded-full">
              {country.flag} {country.name}
            </span>
            <span className="px-3 py-1.5 bg-[#1c1c1e] text-[#f5f5f7] text-sm rounded-full">
              {CONTENT_TYPE_LABELS[trailer.contentType]}
            </span>
            <span className="px-3 py-1.5 bg-[#1c1c1e] text-[#f5f5f7] text-sm rounded-full">
              {trailer.year}
            </span>
            {trailer.platform && (
              <span className="px-3 py-1.5 bg-[#1c1c1e] text-[#f5f5f7] text-sm rounded-full">
                {trailer.platform}
              </span>
            )}
            <span className="px-3 py-1.5 bg-[#1c1c1e] text-[#86868b] text-sm rounded-full">
              {TRAILER_TYPE_LABELS[trailer.trailerType] || trailer.trailerType} 예고편
            </span>
          </div>

          {trailer.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trailer.genres.map((genre) => (
                <span key={genre} className="px-3 py-1 text-[#86868b] text-xs border border-[#38383a] rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
