"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mbti", label: "MBTI" },
  { href: "/temperaments", label: "Temperaments" },
  { href: "/moral-alignment", label: "Alignment" },
  { href: "/cjte", label: "CJTE" },
  { href: "/socionics", label: "Socionics" },
  { href: "/potentiology", label: "Potentiology" },
  { href: "/theory", label: "Theory" },
  { href: "/resources", label: "Resources" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-b border-surface-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide text-foreground">
          Paper Street Corps
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-5 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative transition-colors ${
                isActive(href)
                  ? "text-foreground"
                  : "text-surface-400 hover:text-surface-200"
              }`}
            >
              {label}
              {isActive(href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-accent-blue"
                  transition={{ duration: 0.25 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth actions + theme toggle + hamburger */}
        <div className="flex items-center gap-3">
          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-surface-300 hover:text-foreground transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-xs font-semibold text-accent-blue">
                    {user.email?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="text-sm text-surface-400 hover:text-surface-200 transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-surface-400 hover:text-surface-200 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-800 transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-surface-400 hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
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
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-4 pb-2 text-sm">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition-colors ${
                    isActive(href) ? "text-foreground" : "text-surface-400 hover:text-surface-200"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-surface-800 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-surface-300">
                      Dashboard ({user.email})
                    </Link>
                    <form action="/auth/logout" method="post">
                      <button type="submit" className="text-surface-400 text-left">Sign out</button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-surface-400">Sign in</Link>
                    <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="text-accent-blue">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
