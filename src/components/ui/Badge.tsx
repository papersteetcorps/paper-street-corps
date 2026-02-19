type BadgeColor = "blue" | "purple" | "teal" | "amber" | "neutral";

const colorClasses: Record<BadgeColor, string> = {
  blue: "bg-accent-blue-muted text-accent-blue",
  purple: "bg-accent-purple-muted text-accent-purple",
  teal: "bg-accent-teal-muted text-accent-teal",
  amber: "bg-accent-amber-muted text-accent-amber",
  neutral: "bg-surface-800 text-surface-300",
};

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export default function Badge({
  children,
  color = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
