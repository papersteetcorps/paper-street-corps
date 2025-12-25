export default function ResourcesPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Resources</h1>
        <p className="mt-2 text-neutral-400">
          Source materials, research papers, and documentation for the assessments
          and typology systems used on this site.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">How the Scoring Works</h2>
        <p className="text-neutral-400">
          Our assessments use straightforward methods to match your responses to personality types.
        </p>
        <div className="space-y-3">
          <div className="border border-neutral-800 p-4">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">MBTI Test</div>
            <h3 className="mt-2 font-medium">Finding Your Closest Match</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Each of the 16 MBTI types has an ideal profile based on four traits. When you rate yourself
              on these traits, we compare your answers to all 16 profiles and find which one is most
              similar to yours. Think of it like finding which preset radio station is closest to your
              preferred frequency.
            </p>
          </div>
          <div className="border border-neutral-800 p-4">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">Temperament Test</div>
            <h3 className="mt-2 font-medium">Measuring Consistency</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Each temperament (Choleric, Melancholic, Phlegmatic, Sanguine) has an ideal chemical profile.
              We measure how consistently your answers match each profile. The temperament where your
              answers are most evenly aligned becomes your result. If two temperaments are very close,
              we show you as a blend of both.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Foundational Research</h2>
        <div className="space-y-3">
          <ResourceLink
            title="Psychological Types (Jung, 1921)"
            description="Carl Jung's original work on psychological types, the foundation for MBTI and related systems."
            href="https://jungiancenter.org/wp-content/uploads/2023/09/Vol-6-psychological-types.pdf"
            type="paper"
          />
          <ResourceLink
            title="Why Him? Why Her? (Fisher, 2009)"
            description="Helen Fisher's research on neurochemical correlates of personality and relationship compatibility."
            href="https://helenfisher.com/books"
            type="book"
          />
          <ResourceLink
            title="The Four Temperaments (Eysenck)"
            description="Hans Eysenck's work connecting classical temperaments to biological factors."
            href="https://www.scribd.com/document/423878777/PERSONALITY-docx"
            type="paper"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Typology Systems</h2>
        <div className="space-y-3">
          <ResourceLink
            title="MBTI Manual (Myers & Myers)"
            description="The definitive guide to Myers-Briggs Type Indicator theory and application."
            href="https://eu.themyersbriggs.com/-/media/Files/PDFs/Book-Previews/MB0280e_preview.pdf"
            type="book"
          />
          <ResourceLink
            title="The Enneagram Institute"
            description="Comprehensive resources on the nine Enneagram types and their dynamics."
            href="https://www.enneagraminstitute.com"
            type="website"
          />
          <ResourceLink
            title="Big Five Personality Model"
            description="Academic overview of the research-backed five-factor model of personality."
            href="https://www.verywellmind.com/the-big-five-personality-dimensions-2795422"
            type="website"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Critiques & Limitations</h2>
        <p className="text-neutral-400">
          We believe in presenting limitations alongside theory. These resources
          offer critical perspectives on typology systems.
        </p>
        <div className="space-y-3">
          <ResourceLink
            title="MBTI: Critiques and Alternatives"
            description="Academic analysis of MBTI reliability, validity, and scientific status."
            href="https://eu.themyersbriggs.com/en/Knowledge-centre/Blog/mbti-facts-and-common-criticisms"
            type="paper"
          />
          <ResourceLink
            title="Personality Assessment: A Critical Review"
            description="Overview of different personality models and their empirical support."
            href="https://www.annualreviews.org/doi/abs/10.1146/annurev.psych.53.100901.135239"
            type="paper"
          />
        </div>
      </section>

      <section className="border border-neutral-800 p-5 space-y-3">
        <h2 className="text-lg font-medium">Disclaimer</h2>
        <p className="text-sm text-neutral-400">
          The assessments on this site are educational tools, not clinical instruments.
          Neurochemical correlations are speculative and based on pop-science interpretations
          of complex research. For serious psychological assessment, consult a licensed
          professional.
        </p>
        <p className="text-sm text-neutral-400">
          All scoring algorithms are provided as-is with full source code transparency.
          We make no claims about the validity or reliability of these methods for
          individual assessment.
        </p>
      </section>
    </div>
  );
}

function ResourceLink({
  title,
  description,
  href,
  type,
}: {
  title: string;
  description: string;
  href: string;
  type: "code" | "paper" | "book" | "website";
}) {
  const typeLabels = {
    code: "Source Code",
    paper: "Paper",
    book: "Book",
    website: "Website",
  };

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block border border-neutral-800 p-4 hover:border-neutral-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-500 uppercase tracking-wide">
          {typeLabels[type]}
        </div>
        {isExternal && (
          <span className="text-xs text-neutral-600">External ↗</span>
        )}
      </div>
      <h3 className="mt-2 font-medium">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400">{description}</p>
    </a>
  );
}
