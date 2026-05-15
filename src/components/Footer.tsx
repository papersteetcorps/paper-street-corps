import Link from "next/link";

const LINKS = {
  Assessments: [
    { label: "Jungian Type", href: "/cjte", index: "01" },
    { label: "Socionics", href: "/socionics", index: "02" },
    { label: "Energy Profile", href: "/potentiology", index: "03" },
    { label: "Temperaments", href: "/temperaments", index: "04" },
    { label: "Moral Alignment", href: "/moral-alignment", index: "05" },
    { label: "Enneagram", href: "/enneagram", index: "06" },
  ],
  Research: [
    { label: "Theory Index", href: "/theory", index: "A" },
    { label: "Source Material", href: "/resources", index: "B" },
  ],
};

const TICK_STRIP =
  "repeating-linear-gradient(90deg, transparent 0, transparent 11px, rgba(255, 77, 28, 0.45) 11px, rgba(255, 77, 28, 0.45) 12px)";

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--surface-700)] bg-[#050507] mt-32 overflow-hidden">
      {/* Heat haze rising from below */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 100%, rgba(255, 77, 28, 0.12) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grain / precision grid */}
      <div className="precision-grid opacity-50" />

      {/* Top measurement-tick strip */}
      <div
        aria-hidden="true"
        className="relative h-2 border-b border-[var(--surface-700)]"
        style={{ background: TICK_STRIP }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-6">
        {/* Top meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 mb-14 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--surface-500)]">
          <span className="flex items-center gap-2 text-[var(--ember)]">
            <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
            <span>End of File · Specimen No. 0001</span>
          </span>
          <span className="hidden sm:inline">Open beta · v0.6</span>
          <span>Sealed · {new Date().getFullYear()}</span>
        </div>

        {/* Main grid — manifesto + links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-20">
          {/* Manifesto block */}
          <div className="md:col-span-7 space-y-7">
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ember)]">
                / Manifesto
              </p>
              <p
                className="font-display text-3xl md:text-[2.6rem] leading-[1.05] tracking-[-0.02em] text-[var(--foreground)]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0', fontWeight: 500 }}
              >
                Figure yourself out.
                <br />
                <span
                  className="italic font-light text-[var(--ember)]"
                  style={{
                    fontVariationSettings: '"opsz" 144, "SOFT" 100',
                    textShadow: "0 0 40px rgba(255, 77, 28, 0.3)",
                  }}
                >
                  Then do something about it.
                </span>
              </p>
            </div>
            <p className="text-[13px] text-[var(--surface-400)] leading-relaxed max-w-md">
              Six research-backed psychological frameworks. No multiple choice. No login.
              Your life is the data.
            </p>
            <Link href="/cjte" className="cut-btn cut-btn-ghost">
              <span>Open the File</span>
              <span>→</span>
            </Link>
          </div>

          {/* Link columns */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--surface-500)] mb-5">
                / Assessments
              </p>
              <ul className="space-y-2.5">
                {LINKS.Assessments.map(({ label, href, index }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-3 text-[14px] text-[var(--surface-300)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <span className="text-[10px] font-mono text-[var(--surface-600)] group-hover:text-[var(--ember)] transition-colors w-5">
                        {index}
                      </span>
                      <span className="border-b border-transparent group-hover:border-[var(--ember)] transition-colors">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--surface-500)] mb-5">
                  / Research
                </p>
                <ul className="space-y-2.5">
                  {LINKS.Research.map(({ label, href, index }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="group flex items-center gap-3 text-[14px] text-[var(--surface-300)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <span className="text-[10px] font-mono text-[var(--surface-600)] group-hover:text-[var(--ember)] transition-colors w-5">
                          {index}
                        </span>
                        <span className="border-b border-transparent group-hover:border-[var(--ember)] transition-colors">
                          {label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--surface-500)] mb-2.5">
                  / Status
                </p>
                <p className="flex items-center gap-2 text-[12px] text-[var(--surface-400)] font-mono uppercase tracking-[0.18em]">
                  <span className="w-1.5 h-1.5 bg-[var(--ember)] ember-pulse" />
                  Operational
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Foundry seal — the FORGE wordmark with embossed heat */}
        <div className="relative -mx-6 mb-6">
          {/* Corner crosshairs — mirror the hero specimen card */}
          <span className="absolute top-0 left-6 w-3 h-3 border-l border-t border-[var(--ember)]" />
          <span className="absolute top-0 right-6 w-3 h-3 border-r border-t border-[var(--ember)]" />
          <span className="absolute bottom-0 left-6 w-3 h-3 border-l border-b border-[var(--ember)]" />
          <span className="absolute bottom-0 right-6 w-3 h-3 border-r border-b border-[var(--ember)]" />

          {/* Tiny foundry stamp top-right */}
          <div className="absolute top-5 right-10 hidden sm:flex flex-col items-end gap-1 text-[9px] font-mono uppercase tracking-[0.28em] text-[var(--surface-500)]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-px bg-[var(--ember)]" />
              <span className="text-[var(--ember)]">Foundry Mark</span>
            </span>
            <span>Vol. 01 / Issue 0001</span>
          </div>

          {/* Layered FORGE — heat fill underneath, stroke on top */}
          <div className="relative pt-10 pb-6">
            {/* Layer 1: ember gradient fill seeping up from the bottom */}
            <p
              aria-hidden="true"
              className="absolute inset-x-0 bottom-6 font-display font-medium leading-[0.78] select-none text-[26vw] md:text-[20vw] text-center"
              style={{
                letterSpacing: "-0.05em",
                color: "transparent",
                fontVariationSettings: '"opsz" 144, "SOFT" 0',
                backgroundImage:
                  "linear-gradient(180deg, transparent 0%, rgba(255, 77, 28, 0.05) 40%, rgba(255, 77, 28, 0.32) 80%, rgba(255, 77, 28, 0.55) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              FORGE
            </p>

            {/* Layer 2: crisp stroked outline on top */}
            <p
              aria-hidden="true"
              className="relative font-display font-medium leading-[0.78] select-none text-[26vw] md:text-[20vw] text-center"
              style={{
                letterSpacing: "-0.05em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(245, 245, 247, 0.22)",
                paintOrder: "stroke fill",
                fontVariationSettings: '"opsz" 144, "SOFT" 0',
              }}
            >
              FORGE
            </p>
          </div>

          {/* Ember underline cutting through */}
          <div
            className="absolute left-12 right-12 bottom-[16%] h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--ember) 18%, var(--ember) 82%, transparent 100%)",
              boxShadow: "0 0 24px rgba(255, 77, 28, 0.55)",
            }}
          />
        </div>

        {/* Sign-off + colophon */}
        <div className="border-t border-[var(--surface-700)] pt-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--surface-500)]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2">
              <span className="text-[var(--ember)]">—</span>
              <span>© {new Date().getFullYear()} / Paper Street Corps</span>
            </span>
            <span className="text-[var(--surface-700)]">·</span>
            <span>No tracking</span>
            <span className="text-[var(--surface-700)]">·</span>
            <span>No login</span>
          </div>
          <span className="text-[var(--surface-600)] italic normal-case tracking-normal text-[12px]">
            Built for people who want to get better.
          </span>
        </div>
      </div>

      {/* Bottom measurement-tick strip — mirrors the top */}
      <div
        aria-hidden="true"
        className="relative h-2 border-t border-[var(--surface-700)]"
        style={{ background: TICK_STRIP }}
      />
    </footer>
  );
}
