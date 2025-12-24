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
        <h2 className="text-xl font-medium">Scoring Algorithms</h2>
        <p className="text-neutral-400">
          The scoring methods used in our assessments are openly documented and
          based on published research.
        </p>
        <div className="space-y-3">
          <ResourceLink
            title="MBTI Nearest Centroid Classifier"
            description="Python implementation of neurochemical-based MBTI classification using Euclidean distance to type centroids."
            href="/mbti.py"
            type="code"
          />
          <ResourceLink
            title="Temperament Variance Classifier"
            description="C implementation of variance-based temperament classification with blend detection."
            href="/temperament.c"
            type="code"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Foundational Research</h2>
        <div className="space-y-3">
          <ResourceLink
            title="Psychological Types (Jung, 1921)"
            description="Carl Jung's original work on psychological types, the foundation for MBTI and related systems."
            href="https://archive.org/details/psychologicaltyp00LRAMjung"
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
            href="https://www.simplypsychology.org/eysenck.html"
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
            href="https://www.themyersbriggs.com"
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
            href="https://www.apa.org/topics/personality"
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
            href="https://www.psychologytoday.com/us/blog/give-and-take/201309/goodbye-to-mbti-the-fad-that-won-t-die"
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
