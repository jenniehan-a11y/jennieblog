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
    <div className="space-y-2.5">
      <span className="text-white/25 text-[11px] font-semibold tracking-[0.15em] uppercase">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
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
