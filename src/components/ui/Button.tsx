"use client";

import { motion } from "motion/react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<Variant, string> = {
  primary: "cut-btn",
  secondary: "cut-btn cut-btn-ghost",
  ghost:
    "inline-flex items-center gap-2 px-4 py-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--surface-400)] hover:text-[var(--foreground)] transition-colors",
};

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
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.1 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      {children}
    </motion.button>
  );
}
