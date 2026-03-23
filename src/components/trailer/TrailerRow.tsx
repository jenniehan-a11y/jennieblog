'use client';

import { useState } from 'react';
import { Trailer } from '@/types/trailer';
import TrailerCard from './TrailerCard';
import TrailerModal from './TrailerModal';

interface TrailerRowProps {
  id?: string;
  title: string;
  trailers: Trailer[];
  size?: 'large' | 'medium' | 'small';
  showDate?: boolean;
}

export default function TrailerRow({ id, title, trailers, size = 'medium', showDate = false }: TrailerRowProps) {
  const [selected, setSelected] = useState<Trailer | null>(null);

  if (trailers.length === 0) return null;

  return (
    <section id={id} className="space-y-5">
      <div className="px-6 lg:px-10">
        <h2 className="text-white text-2xl font-black tracking-[-0.03em] uppercase">{title}</h2>
      </div>

      <div className="scroll-row px-6 lg:px-10">
        {trailers.map((t) => (
          <TrailerCard key={t.id} trailer={t} onPlay={setSelected} size={size} showDate={showDate} />
        ))}
      </div>

      {selected && <TrailerModal trailer={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
