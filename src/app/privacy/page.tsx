import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Privacy Policy — Forge",
};

export default function PrivacyPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <div className="space-y-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-surface-400 text-sm mt-2">Last updated: April 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">What Forge collects</h2>
          <div className="space-y-3 text-surface-300 text-sm leading-relaxed">
            <p>
              <strong className="text-foreground">Your assessment answers</strong> are stored locally in your browser (localStorage).
              They never leave your device unless you submit them for interpretation.
            </p>
            <p>
              <strong className="text-foreground">When you complete an assessment</strong>, your answers are sent to a third-party
              language model (Anthropic Claude) to generate your personality profile. The answers are processed
              in real time and are not stored by Forge after your results are generated.
            </p>
            <p>
              <strong className="text-foreground">No account is required.</strong> Forge does not collect your name, email,
              phone number, or any personal identifiers unless you create an account (currently unavailable).
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Cookies and tracking</h2>
          <div className="space-y-3 text-surface-300 text-sm leading-relaxed">
            <p>
              <strong className="text-foreground">Forge does not use tracking cookies, analytics, or advertising pixels.</strong> No
              data is shared with advertisers or data brokers.
            </p>
            <p>
              Forge uses <strong className="text-foreground">essential cookies only</strong> when account features are enabled (for session management).
              These are strictly necessary for the service to function and do not track your behavior.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Third-party services</h2>
          <div className="space-y-3 text-surface-300 text-sm leading-relaxed">
            <p>
              <strong className="text-foreground">Anthropic (Claude)</strong> processes your assessment answers to generate results.
              Forge has opted out of data training with Anthropic. Your answers are processed in real time
              and are not used to train models.{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                Anthropic Privacy Policy
              </a>
            </p>
            <p>
              <strong className="text-foreground">Vercel</strong> hosts this website. Standard server logs (IP address, browser type)
              may be collected as part of normal web hosting.{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                Vercel Privacy Policy
              </a>
            </p>
            <p>
              <strong className="text-foreground">Web Speech API</strong> (browser-native) is used for voice input. Audio is processed
              locally by your browser and is not sent to Forge servers.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Your data, your control</h2>
          <div className="space-y-3 text-surface-300 text-sm leading-relaxed">
            <p>
              <strong className="text-foreground">Delete your results anytime.</strong> Clear your browser&apos;s localStorage to remove
              all saved assessment results. Forge has no server-side copy.
            </p>
            <p>
              <strong className="text-foreground">GDPR and CCPA.</strong> If you are in the EU or California and have questions about
              your data, contact us at{" "}
              <a href="mailto:admin@paperstreetcorps.com" className="text-accent-blue hover:underline">
                admin@paperstreetcorps.com
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Changes to this policy</h2>
          <p className="text-surface-300 text-sm leading-relaxed">
            This policy will be updated as Forge adds features (accounts, voice conversations, therapist booking).
            Major changes will be noted here with the date.
          </p>
        </section>

        <div className="pt-4 border-t border-surface-700">
          <Link href="/" className="text-sm text-accent-blue hover:underline">
            Back to Forge
          </Link>
        </div>
      </div>
    </Container>
  );
}
