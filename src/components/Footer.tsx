import Link from "next/link";

const LINKS = {
  Assessments: [
    { label: "Jungian Type", href: "/cjte" },
    { label: "Socionics", href: "/socionics" },
    { label: "Energy Profile", href: "/potentiology" },
    { label: "Temperaments", href: "/temperaments" },
    { label: "Moral Alignment", href: "/moral-alignment" },
    { label: "Enneagram", href: "/enneagram" },
  ],
  Resources: [
    { label: "Theory", href: "/theory" },
    { label: "Research Papers", href: "/resources" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Artistic background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        {/* Abstract gradient art as background (no external image needed) */}
        <div className="absolute inset-0 bg-surface-900" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 20% 80%, rgba(232, 98, 42, 0.3) 0%, transparent 50%), " +
              "radial-gradient(ellipse 100% 60% at 80% 60%, rgba(124, 58, 237, 0.25) 0%, transparent 50%), " +
              "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(201, 154, 46, 0.2) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Links section */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <p className="font-display font-bold text-lg text-foreground">Forge</p>
            <p className="text-sm text-surface-400 leading-relaxed max-w-xs">
              Figure yourself out. Then do something about it.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading} className="space-y-4">
              <p className="text-xs text-surface-500 uppercase tracking-widest">{heading}</p>
              <div className="space-y-2.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-surface-400 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Giant brand text — Instrument Sans, tight tracking, visible gradient */}
        <div className="relative max-w-5xl mx-auto px-6 pb-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(232, 98, 42, 0.12) 0%, transparent 60%)",
            }}
          />
          <p
            className="relative font-brand font-semibold text-[16vw] md:text-[13vw] leading-[0.85] select-none"
            style={{
              letterSpacing: "-0.06em",
              background: "linear-gradient(135deg, rgba(168, 139, 250, 0.35) 0%, rgba(232, 98, 42, 0.30) 40%, rgba(201, 154, 46, 0.25) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 60px rgba(232, 98, 42, 0.1))",
            }}
            aria-hidden="true"
          >
            FORGE
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-700/50 max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <p className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} Forge
          </p>
          <p className="text-xs text-surface-600">
            Built for people who want to get better.
          </p>
        </div>
      </div>
    </footer>
  );
}
