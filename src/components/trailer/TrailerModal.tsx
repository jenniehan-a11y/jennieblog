'use client';

import { useEffect } from 'react';
import { Trailer } from '@/types/trailer';
import { getCountryInfo } from '@/lib/data/countries';
import { CONTENT_TYPE_LABELS } from '@/lib/data/tags';
import YouTubePlayer from './YouTubePlayer';

interface TrailerModalProps {
  trailer: Trailer;
  onClose: () => void;
}

export default function TrailerModal({ trailer, onClose }: TrailerModalProps) {
  const country = getCountryInfo(trailer.country);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center fade-in" onClick={onClose}>
      <div className="w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
        {/* 닫기 */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors text-2xl font-light">
            ×
          </button>
        </div>

        {/* 영상 */}
        <div className="rounded-lg overflow-hidden">
          <YouTubePlayer youtubeId={trailer.youtubeId} autoplay />
        </div>

        {/* 정보 */}
        <div className="mt-6">
          <h2 className="text-white text-2xl font-bold tracking-[-0.03em]">{trailer.title}</h2>
          {trailer.titleOriginal !== trailer.title && (
            <p className="text-white/25 text-sm mt-1">{trailer.titleOriginal}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-white/40">
            <span>{country.flag} {country.name}</span>
            <span className="text-white/10">·</span>
            <span>{CONTENT_TYPE_LABELS[trailer.contentType]}</span>
            <span className="text-white/10">·</span>
            <span>{trailer.year}</span>
            {trailer.genres.map(g => (
              <span key={g} className="px-2.5 py-0.5 rounded-full border border-white/10 text-white/35 text-xs">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
