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
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-5xl mx-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-black/30 hover:text-black text-sm font-bold uppercase tracking-[0.1em] transition-colors">
            Close ×
          </button>
        </div>

        <div className="rounded-md overflow-hidden shadow-2xl shadow-black/10">
          <YouTubePlayer youtubeId={trailer.youtubeId} autoplay />
        </div>

        <div className="mt-6">
          <h2 className="text-black text-3xl font-black tracking-[-0.04em] uppercase">{trailer.title}</h2>
          {trailer.titleOriginal !== trailer.title && (
            <p className="text-black/25 text-sm mt-1">{trailer.titleOriginal}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-black/40 uppercase tracking-[0.05em] font-semibold">
            <span>{country.flag} {country.name}</span>
            <span>·</span>
            <span>{CONTENT_TYPE_LABELS[trailer.contentType]}</span>
            <span>·</span>
            <span>{trailer.year}</span>
            {trailer.genres.map(g => (
              <span key={g} className="px-2.5 py-1 border border-black/10 rounded-full">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
