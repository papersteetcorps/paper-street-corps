"use client";

import ProgressBar from "@/components/ui/ProgressBar";

interface ProgressHeaderProps {
  current: number;
  total: number;
  title: string;
}

export default function ProgressHeader({
  current,
  total,
  title,
}: ProgressHeaderProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.25em]">
        <span className="flex items-center gap-2 text-[var(--ember)] min-w-0">
          <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse flex-shrink-0" />
          <span className="truncate">{title}</span>
        </span>
        <span className="text-[var(--surface-400)] flex-shrink-0 tabular-nums">
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")} · {String(pct).padStart(3, "0")}%
        </span>
      </div>
      <ProgressBar current={current} total={total} />
    </div>
  );
}
