"use client";

import { motion } from "motion/react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent-blue text-white hover:bg-accent-blue/90 shadow-sm shadow-accent-blue/20",
  secondary:
    "border border-surface-600 text-surface-200 hover:bg-surface-800 hover:border-surface-500",
  ghost: "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50",
};

interface ButtonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  onClick,
  disabled,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
