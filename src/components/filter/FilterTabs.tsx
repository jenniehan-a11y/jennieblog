'use client';

import { Region } from '@/types/trailer';

interface FilterTabsProps {
  value: Region | 'all';
  onChange: (value: Region | 'all') => void;
}

const tabs: { value: Region | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'domestic', label: '국내' },
  { value: 'international', label: '해외' },
];

export default function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-200 ${
            value === tab.value
              ? 'bg-[#f5f5f7] text-black'
              : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-[#1c1c1e]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
