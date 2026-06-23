'use client';

import { SECTIONS, SECTION_COLORS } from '@/lib/questions';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
  sectionName: string;
  sectionIndex: number;
}

export default function ProgressBar({ currentIndex, total, sectionName, sectionIndex }: ProgressBarProps) {
  const pct = Math.round(((currentIndex + 1) / total) * 100);
  const color = SECTION_COLORS[sectionName] ?? '#FF5C00';

  return (
    <div className="w-full">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {sectionName}
        </span>
        <span className="text-xs text-[#6B6B6B] font-medium">
          {currentIndex + 1} of {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>

      {/* Section dots */}
      <div className="flex gap-1 mt-2">
        {SECTIONS.map((section, i) => (
          <div
            key={section}
            className="flex-1 h-0.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i < sectionIndex ? '#FF5C00' : i === sectionIndex ? color : '#E8E5DF',
            }}
          />
        ))}
      </div>
    </div>
  );
}
