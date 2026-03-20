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
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md fade-in" onClick={onClose}>
      <div className="w-full max-w-5xl mx-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end mb-3">
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] flex items-center justify-center transition-all">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
          <YouTubePlayer youtubeId={trailer.youtubeId} autoplay />
        </div>

        <div className="mt-5 space-y-3">
          <h2 className="text-white text-xl font-bold tracking-[-0.02em]">{trailer.title}</h2>
          {trailer.titleOriginal !== trailer.title && (
            <p className="text-white/20 text-sm -mt-1">{trailer.titleOriginal}</p>
          )}
          <div className="flex flex-wrap gap-2 text-[12px]">
            {[`${country.flag} ${country.name}`, CONTENT_TYPE_LABELS[trailer.contentType], String(trailer.year), trailer.platform, `${TRAILER_TYPE_LABELS[trailer.trailerType] || trailer.trailerType} 예고편`].filter(Boolean).map((t, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.04]">{t}</span>
            ))}
          </div>
          {trailer.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {trailer.genres.map(g => (
                <span key={g} className="px-2.5 py-0.5 rounded-full text-white/20 text-[11px] border border-white/[0.04]">{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
