'use client';

import { SortOption } from '@/types/filters';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'title', label: '제목순' },
  { value: 'year', label: '연도순' },
];

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="bg-white/[0.04] text-white/50 text-[12px] font-medium rounded-lg px-3 py-1.5 border border-white/[0.06] focus:outline-none focus:border-white/[0.12] cursor-pointer appearance-none transition-colors hover:text-white/70"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
          {option.label}
        </option>
      ))}
    </select>
  );
}
