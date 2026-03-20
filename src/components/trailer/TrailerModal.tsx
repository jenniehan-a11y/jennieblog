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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl mx-6 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors border border-white/[0.06]"
          >
            <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 영상 */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <YouTubePlayer youtubeId={trailer.youtubeId} autoplay />
        </div>

        {/* 정보 */}
        <div className="mt-6 space-y-4">
          <h2 className="text-white text-2xl font-bold tracking-tight">{trailer.title}</h2>
          {trailer.titleOriginal !== trailer.title && (
            <p className="text-white/30 text-sm -mt-2">{trailer.titleOriginal}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {[
              `${country.flag} ${country.name}`,
              CONTENT_TYPE_LABELS[trailer.contentType],
              String(trailer.year),
              trailer.platform,
              `${TRAILER_TYPE_LABELS[trailer.trailerType] || trailer.trailerType} 예고편`,
            ].filter(Boolean).map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white/[0.04] text-white/60 text-[13px] rounded-lg border border-white/[0.04]">
                {tag}
              </span>
            ))}
          </div>

          {trailer.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trailer.genres.map((genre) => (
                <span key={genre} className="px-2.5 py-0.5 text-white/25 text-[12px] rounded-md border border-white/[0.06]">
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
