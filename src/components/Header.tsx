"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { FLAGS } from "@/lib/flags";

const ASSESSMENT_LINKS = [
  { href: "/cjte", label: "MBTI", index: "01" },
  { href: "/temperaments", label: "Temperaments", index: "02" },
  { href: "/moral-alignment", label: "Moral Alignment", index: "03" },
  { href: "/socionics", label: "Socionics", index: "04" },
  { href: "/potentiology", label: "Energy Profile", index: "05" },
  { href: "/enneagram", label: "Enneagram", index: "06" },
];

const TOP_LINKS = [
  { href: "/", label: "Index" },
  { href: "/synthesis", label: "Results" },
  { href: "/resources", label: "Research" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileAssessmentsOpen, setMobileAssessmentsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!FLAGS.AUTH_ENABLED) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isAnyAssessmentActive = ASSESSMENT_LINKS.some((l) => isActive(l.href));

  const openDropdown = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--surface-700)] bg-[#0a0a0c]/85 backdrop-blur-md">
      {/* Top stamp bar */}
      <div className="hidden md:flex border-b border-[var(--surface-700)]/60 px-6 py-1.5 items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)]">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
          <span>Forge / Personality Foundry</span>
        </span>
        <span className="flex items-center gap-4">
          <span>Est. 2026</span>
          <span className="text-[var(--surface-600)]">·</span>
          <span>Six Frameworks</span>
        </span>
      </div>

      {/* Main bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-7 h-7 border border-[var(--ember)] flex items-center justify-center">
            <div className="absolute inset-[3px] bg-[var(--ember)]" />
            <span className="relative text-[10px] font-mono font-bold text-[#0a0a0c]">F</span>
          </div>
          <span
            className="font-display font-medium text-[1.35rem] text-[var(--foreground)] tracking-tight"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            Forge
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-mono uppercase tracking-[0.14em]">
          {TOP_LINKS.filter((l) => l.href === "/").map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative py-1 transition-colors ${
                isActive(href)
                  ? "text-[var(--foreground)]"
                  : "text-[var(--surface-400)] hover:text-[var(--foreground)]"
              }`}
            >
              {label}
              {isActive(href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--ember)]"
                  transition={{ duration: 0.25 }}
                />
              )}
            </Link>
          ))}

          {/* Assessments dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button
              className={`relative flex items-center gap-1.5 py-1 transition-colors ${
                isAnyAssessmentActive
                  ? "text-[var(--foreground)]"
                  : "text-[var(--surface-400)] hover:text-[var(--foreground)]"
              }`}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Tests
              <span className="text-[9px] text-[var(--surface-500)]">[06]</span>
              {isAnyAssessmentActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--ember)]"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[280px] bg-[#0a0a0c] border border-[var(--surface-700)] py-2 z-50"
                  style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,77,28,0.08)" }}
                >
                  <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)] border-b border-[var(--surface-700)] mb-1">
                    Assessments / 06
                  </div>
                  {ASSESSMENT_LINKS.map(({ href, label, index }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setDropdownOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2 transition-colors ${
                        isActive(href)
                          ? "text-[var(--foreground)] bg-[var(--ember-muted)]"
                          : "text-[var(--surface-300)] hover:text-[var(--foreground)] hover:bg-[var(--surface-800)]"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[var(--surface-500)] group-hover:text-[var(--ember)] transition-colors w-6">
                        {index}
                      </span>
                      <span className="text-[13px] tracking-tight normal-case font-body">{label}</span>
                      <span className="ml-auto text-[var(--surface-600)] group-hover:text-[var(--ember)] transition-colors">→</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {TOP_LINKS.filter((l) => l.href !== "/").map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative py-1 transition-colors ${
                isActive(href)
                  ? "text-[var(--foreground)]"
                  : "text-[var(--surface-400)] hover:text-[var(--foreground)]"
              }`}
            >
              {label}
              {isActive(href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--ember)]"
                  transition={{ duration: 0.25 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth + CTA */}
        <div className="flex items-center gap-3">
          {FLAGS.AUTH_ENABLED && (
            <div className="hidden md:flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.14em]">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-[var(--surface-300)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <span className="w-6 h-6 bg-[var(--ember)] text-[#0a0a0c] flex items-center justify-center text-[10px] font-bold">
                      {user.email?.[0]?.toUpperCase() ?? "U"}
                    </span>
                    <span className="hidden lg:inline">File</span>
                  </Link>
                  <form action="/auth/logout" method="post">
                    <button
                      type="submit"
                      className="text-[var(--surface-400)] hover:text-[var(--foreground)] transition-colors"
                    >
                      Exit
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-[var(--surface-400)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Enter
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-[var(--ember)] hover:text-[var(--ember-hot)] transition-colors"
                  >
                    Open File →
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1 border border-[var(--surface-700)] hover:border-[var(--ember)] transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-3.5 h-px bg-[var(--foreground)] transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block w-3.5 h-px bg-[var(--foreground)] transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-[var(--surface-700)]"
          >
            <div className="flex flex-col px-6 py-4 gap-3 text-sm font-mono uppercase tracking-[0.14em]">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`py-1 transition-colors ${
                  isActive("/") ? "text-[var(--foreground)]" : "text-[var(--surface-400)]"
                }`}
              >
                Index
              </Link>

              <div>
                <button
                  onClick={() => setMobileAssessmentsOpen((v) => !v)}
                  className={`flex items-center justify-between w-full py-1 transition-colors ${
                    isAnyAssessmentActive ? "text-[var(--foreground)]" : "text-[var(--surface-400)]"
                  }`}
                >
                  <span>Tests [06]</span>
                  <span className="text-[var(--surface-500)]">{mobileAssessmentsOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {mobileAssessmentsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 pl-4 pt-2 border-l border-[var(--ember)]/40 ml-1">
                        {ASSESSMENT_LINKS.map(({ href, label, index }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => {
                              setMenuOpen(false);
                              setMobileAssessmentsOpen(false);
                            }}
                            className={`flex items-center gap-3 py-1 transition-colors ${
                              isActive(href)
                                ? "text-[var(--foreground)]"
                                : "text-[var(--surface-400)]"
                            }`}
                          >
                            <span className="text-[10px] text-[var(--surface-500)]">{index}</span>
                            <span className="normal-case font-body tracking-tight">{label}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {TOP_LINKS.filter((l) => l.href !== "/").map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-1 transition-colors ${
                    isActive(href) ? "text-[var(--foreground)]" : "text-[var(--surface-400)]"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {FLAGS.AUTH_ENABLED && (
                <div className="pt-2 border-t border-[var(--surface-700)] flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-[var(--surface-300)]">
                        File ({user.email})
                      </Link>
                      <form action="/auth/logout" method="post">
                        <button type="submit" className="text-[var(--surface-400)] text-left">
                          Exit
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-[var(--surface-400)]">
                        Enter
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="text-[var(--ember)]">
                        Open File →
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
