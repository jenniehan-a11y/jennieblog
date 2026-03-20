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
    <div className="inline-flex bg-white/[0.04] rounded-xl p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative px-5 py-1.5 text-[13px] font-medium rounded-[10px] transition-all duration-200 ${
            value === tab.value
              ? 'bg-white text-[#0a0a0a] shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
