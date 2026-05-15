"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, animate, useInView } from "motion/react";

interface CountUpProps {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  pad?: number;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  to,
  duration = 1.4,
  format,
  pad,
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(format ? format(0) : pad ? "0".padStart(pad, "0") : "0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      ease: [0.2, 0.9, 0.3, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        if (format) {
          setDisplay(format(rounded));
        } else if (pad) {
          setDisplay(String(rounded).padStart(pad, "0"));
        } else {
          setDisplay(String(rounded));
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, value, format, pad]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
