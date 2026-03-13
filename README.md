# Paper Street Corps

A minimal personality assessment platform featuring interactive psychometric tests, AI-powered interpretation, and cross-framework synthesis.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Motion (Framer Motion) | 12.x |
| Charts | Recharts | 3.x |
| AI API | Anthropic SDK | 0.78.x |
| Auth / DB | Supabase (SSR) | 2.x |
| Theme | next-themes | 0.4.x |
| Deployment | Vercel | — |
| Scoring (standalone) | Python (NumPy), C | — |

## Project Structure

```
paper-street-corps/
├── src/
│   ├── app/                              # Next.js App Router — all routes
│   │   ├── layout.tsx                    # Root layout: Header + Footer + ThemeProvider
│   │   ├── page.tsx                      # Landing page with test CTAs and theory cards
│   │   ├── globals.css                   # Tailwind base + custom CSS variables
│   │   │
│   │   ├── cjte/page.tsx                 # Classic Jungian Typology Engine (CJTE-3) test
│   │   ├── socionics/page.tsx            # Socionics KIME-3 test
│   │   ├── potentiology/page.tsx         # Potentiology PBCE-1 test
│   │   ├── temperaments/page.tsx         # Temperament variance-based test
│   │   ├── moral-alignment/page.tsx      # Moral Alignment 3x3 grid test
│   │   │
│   │   ├── synthesis/                    # Cross-framework synthesis
│   │   │   ├── page.tsx                  # Server entry
│   │   │   └── SynthesisClient.tsx       # Client component — combines results from multiple tests
│   │   │
│   │   ├── theory/                       # Educational theory pages
│   │   │   ├── page.tsx                  # Theory index
│   │   │   ├── jungian/page.tsx          # Jungian Typology summary
│   │   │   ├── socionics/page.tsx        # Socionics / Model A summary
│   │   │   ├── potentiology/page.tsx     # Potentiology energy model summary
│   │   │   ├── moral-alignment/page.tsx  # Moral Alignment grid explanation
│   │   │   └── enneagram/page.tsx        # Enneagram theory (no interactive test)
│   │   │
│   │   ├── resources/page.tsx            # PDF downloads, scoring explanations, disclaimer
│   │   ├── dashboard/page.tsx            # User dashboard (requires auth)
│   │   │
│   │   ├── auth/                         # Authentication routes
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── logout/route.ts
│   │   │   └── callback/route.ts
│   │   │
│   │   └── api/                          # Server-side API routes
│   │       ├── generate-questions/route.ts   # AI-generated test questions
│   │       ├── score-results/route.ts        # AI interpretation + Supabase save
│   │       ├── chat/route.ts                 # Post-result Q&A streaming chat
│   │       └── synthesize/route.ts           # Cross-framework profile synthesis
│   │
│   ├── components/                       # Reusable UI components
│   │   ├── Header.tsx                    # Site navigation bar
│   │   ├── Footer.tsx                    # Site footer
│   │   ├── Card.tsx                      # Generic card wrapper
│   │   ├── Tabs.tsx                      # Tab navigation
│   │   ├── ThemeProvider.tsx             # Dark/light theme context
│   │   │
│   │   ├── ui/                           # Primitive UI elements
│   │   │   ├── Button.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── wizard/                       # Test wizard system (shared across all tests)
│   │   │   ├── WizardShell.tsx           # State machine: intro → questions → loading → results
│   │   │   ├── QuestionCard.tsx          # Renders a single question (scale or text input)
│   │   │   ├── AnswerInput.tsx           # Input component (slider or textarea)
│   │   │   ├── WizardNavigation.tsx      # Back / Next / Submit buttons
│   │   │   └── ProgressHeader.tsx        # Question counter progress bar
│   │   │
│   │   ├── results/                      # Result display components
│   │   │   ├── ResultsLayout.tsx         # Common results page wrapper
│   │   │   ├── TypeCard.tsx              # Type badge and headline
│   │   │   ├── NarrativeSection.tsx      # AI-generated narrative block
│   │   │   ├── ResultChat.tsx            # Post-result streaming Q&A chat
│   │   │   ├── RadarChart.tsx            # Radar chart (Recharts)
│   │   │   ├── BarChart.tsx              # Bar chart (Recharts)
│   │   │   ├── ScoreComparison.tsx       # Side-by-side score comparison
│   │   │   └── ConfidenceRanking.tsx     # Ranked distance/confidence list
│   │   │
│   │   ├── cards/                        # Homepage card components
│   │   │   ├── TestCard.tsx              # Interactive test CTA card
│   │   │   └── TheoryCard.tsx            # Theory page link card
│   │   │
│   │   └── layout/
│   │       └── PageTransition.tsx        # Framer Motion page transition wrapper
│   │
│   ├── lib/                              # Core logic and utilities
│   │   ├── scoring/                      # Client-side scoring algorithms
│   │   │   ├── temperaments.ts           # Variance-based temperament classifier
│   │   │   └── moralAlignment.ts         # Two-axis 3x3 grid classifier
│   │   │
│   │   ├── anthropic/                    # AI integration (server-only)
│   │   │   ├── client.ts                 # Singleton API client + model config
│   │   │   ├── prompts.ts                # Prompt registry: generate + interpret per test type
│   │   │   └── schemas.ts                # JSON validation for AI responses
│   │   │
│   │   ├── supabase/                     # Database client
│   │   │   ├── client.ts                 # Browser client
│   │   │   └── server.ts                 # Server-side client (cookie-based auth)
│   │   │
│   │   └── types/
│   │       ├── wizard.ts                 # WizardQuestion, WizardAnswer, WizardPhase, WizardState
│   │       └── scoring.ts                # Scoring result types
│   │
│   ├── data/
│   │   └── offerings.ts                  # Homepage test + theory card definitions
│   │
│   └── proxy.ts                          # Supabase middleware for session refresh
│
├── public/data/                          # Static corpus files for AI prompts
│   ├── Enneagram.pdf
│   ├── Potentiology_Cognitive_Energy_Framework (1).pdf
│   ├── VRDW CJTE-2.pdf
│   ├── vrdw_cjte_cache.txt              # CJTE scoring logic cache
│   ├── vrdw_cjte_corpus.txt             # Jungian typology corpus
│   ├── vrdw_cjte_instructions.txt       # CJTE engine instructions
│   ├── vrdw_kime_corpus.json            # Socionics Model A corpus
│   ├── vrdw_kime_instructions.txt       # KIME engine instructions
│   ├── vrdw_pbce_corpus.json            # Potentiology corpus
│   └── vrdw_pbce_instructions.txt       # PBCE engine instructions
│
├── mbti.py                               # Standalone MBTI nearest-centroid classifier (Python/NumPy)
├── temperament.c                         # Standalone temperament classifier (C)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

## Architecture Overview

### Request Flow

```
User (browser)
  │
  ├─► Test Page (client component)
  │     │
  │     ├─► GET /api/generate-questions ──► Anthropic API ──► AI-generated questions
  │     │
  │     ├─► WizardShell (state machine) ──► collects answers
  │     │
  │     ├─► Client-side scoring (temperaments.ts / moralAlignment.ts)
  │     │
  │     ├─► POST /api/score-results ──► Anthropic API ──► AI narrative interpretation
  │     │                            └──► Supabase ──► saves result (if logged in)
  │     │
  │     └─► POST /api/chat ──► Anthropic API ──► streaming Q&A about results
  │
  └─► Synthesis Page
        └─► POST /api/synthesize ──► Anthropic API ──► unified cross-framework profile
```

### Test Lifecycle (all 5 tests follow this pattern)

1. **Question Generation** — `/api/generate-questions` sends a framework-specific system prompt (loaded from `lib/anthropic/prompts.ts` with corpus files from `public/data/`) to the AI, which returns structured JSON questions. If the API is unavailable, tests fall back to hardcoded questions.

2. **Wizard Flow** — `WizardShell` manages a `useReducer` state machine with phases: `intro → questions → loading → results → error`. Supports both scale (1-5 slider) and text (open-ended) input types.

3. **Scoring** — Two scoring paths:
   - **Client-side** (Temperaments, Moral Alignment): deterministic algorithms in `lib/scoring/` compute results locally before sending to the API.
   - **AI-only** (CJTE, Socionics, Potentiology): open-ended text answers are sent directly to `/api/score-results` for AI analysis.

4. **Interpretation** — `/api/score-results` sends answers + local scores to the AI with a framework-specific interpretation prompt. Returns structured JSON (headline, summary, insights, strengths, challenges, growth path).

5. **Post-Result Chat** — `/api/chat` enables a streaming "Doubt Session" where users can question or challenge their results. The AI defends or nuances the result using corpus evidence.

### Scoring Algorithms

| Test | Method | Input | Output |
|------|--------|-------|--------|
| Temperaments | Variance of differences vs ideal profiles | 5 chemical ratings (1-5) | Primary temperament + optional blend |
| Moral Alignment | Two-axis threshold classification | Structure + Impulse scores (1-5) | 3x3 grid cell (e.g. "Chaotic Good") |
| CJTE | AI corpus analysis | 8 open-ended text answers | MBTI type + function stack |
| Socionics | AI corpus analysis | 16 open-ended text answers | Sociotype + Model A stack + quadra |
| Potentiology | AI corpus analysis | 16 open-ended text answers | PBCE type + energy stack + burnout pattern |

### AI Integration

All AI calls go through `lib/anthropic/` (server-only):
- `client.ts` — singleton API client, reads `ANTHROPIC_API_KEY` from env
- `prompts.ts` — prompt registry that loads corpus files from `public/data/` at runtime and builds framework-specific system prompts
- `schemas.ts` — validates AI JSON responses before passing to the client

Each test type has a **generate** prompt (for questions) and an **interpret** prompt (for results). The three corpus-heavy tests (CJTE, Socionics, Potentiology) inject full research documents into the system prompt for grounded analysis.

### Synthesis

The `/api/synthesize` route accepts results from 2+ completed tests and produces a unified psychological profile. It loads all three corpus files and asks the AI to find convergences, divergences, blind spots, and growth paths across frameworks.

### Standalone Scoring Scripts

- `mbti.py` — Python/NumPy nearest-centroid classifier for MBTI. Uses Euclidean distance from user's 4 biochemical ratings to 16 type centroids. Runs as a standalone CLI tool.
- `temperament.c` — C implementation of the variance-based temperament classifier. Standalone CLI equivalent of `lib/scoring/temperaments.ts`.

### Data Layer

- **Supabase** — optional auth (login/signup) and result history storage. The proxy middleware (`src/proxy.ts`) refreshes sessions on every request. Test results are saved to a `test_results` table when a user is logged in (fire-and-forget).
- **LocalStorage** — synthesis page reads previously completed test results from the browser.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | AI question generation, scoring, and chat |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL (for auth + history) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key |

### Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Deployment

Deployed on Vercel with automatic deploys from the `main` branch.
