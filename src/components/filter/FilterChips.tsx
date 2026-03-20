'use client';

interface FilterChipsProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function FilterChips({
  label,
  options,
  selected,
  onChange,
}: FilterChipsProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-[#86868b] text-[11px] font-semibold tracking-widest uppercase">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              className={`px-3.5 py-1.5 text-[12px] rounded-full transition-all duration-200 ${
                isSelected
                  ? 'bg-[#f5f5f7] text-black font-medium'
                  : 'text-[#86868b] hover:text-[#f5f5f7] border border-[#38383a] hover:border-[#636366]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
