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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-surface-300">{title}</span>
        <span className="text-surface-400">
          {current} of {total}
        </span>
      </div>
      <ProgressBar current={current} total={total} />
    </div>
  );
}
