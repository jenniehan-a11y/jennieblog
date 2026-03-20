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
      className="bg-transparent text-[#86868b] text-[13px] font-medium rounded-full px-4 py-2 border border-[#38383a] hover:border-[#636366] focus:outline-none cursor-pointer appearance-none transition-colors"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value} className="bg-black">
          {option.label}
        </option>
      ))}
    </select>
  );
}
