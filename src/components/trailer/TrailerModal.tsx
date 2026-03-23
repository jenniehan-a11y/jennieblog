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
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-5xl mx-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-white/30 hover:text-white text-sm font-bold uppercase tracking-[0.1em] transition-colors">
            Close
          </button>
        </div>

        <div className="rounded-sm overflow-hidden">
          <YouTubePlayer youtubeId={trailer.youtubeId} autoplay />
        </div>

        <div className="mt-6">
          <h2 className="text-white text-3xl font-black tracking-[-0.03em]">{trailer.title}</h2>
          {trailer.titleOriginal !== trailer.title && (
            <p className="text-white/20 text-sm mt-1">{trailer.titleOriginal}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/40 uppercase tracking-[0.05em]">
            <span>{country.flag} {country.name}</span>
            <span>{CONTENT_TYPE_LABELS[trailer.contentType]}</span>
            <span>{trailer.year}</span>
            {trailer.genres.map(g => (
              <span key={g} className="px-3 py-1 border border-white/10 rounded-full">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
