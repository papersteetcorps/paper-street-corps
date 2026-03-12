"use client";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labels?: [string, string];
}

export default function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  labels,
}: SliderProps) {
  return (
    <div className="w-full space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
      {labels && (
        <div className="flex justify-between text-xs text-surface-500">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}
