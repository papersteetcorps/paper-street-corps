# Paper Street Corps

A minimal personality assessment platform built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Header, Footer, theme)
│   ├── page.tsx                  # Homepage with test CTAs and theory cards
│   │
│   ├── mbti/
│   │   └── page.tsx              # Interactive MBTI test (4 trait sliders)
│   │
│   ├── temperaments/
│   │   └── page.tsx              # Interactive Temperament test (5 chemical sliders)
│   │
│   ├── theory/
│   │   ├── page.tsx              # Theory index (links to educational content)
│   │   ├── jungian/
│   │   │   └── page.tsx          # Jungian Typology educational card
│   │   ├── moral-alignment/
│   │   │   └── page.tsx          # Moral Alignment educational card
│   │   └── enneagram/
│   │       └── page.tsx          # Enneagram educational card
│   │
│   └── resources/
│       └── page.tsx              # Research links, scoring explanations, disclaimer
│
├── components/                   # Reusable UI components
│   ├── Header.tsx                # Navigation bar
│   ├── Footer.tsx                # Site footer
│   ├── Card.tsx                  # Generic card component
│   └── Tabs.tsx                  # Tab navigation component
│
├── lib/                          # Core logic and utilities
│   └── scoring/
│       ├── mbti.ts               # MBTI scoring algorithm (Nearest Centroid)
│       └── temperaments.ts       # Temperament scoring algorithm (Variance-Based)
│
└── data/
    └── offerings.ts              # Homepage card data
```

## Scoring Algorithms

### MBTI (`src/lib/scoring/mbti.ts`)

**Method**: Nearest Centroid Classification

- User rates 4 traits (Dopamine, Serotonin, Testosterone, Estrogen) on a 1-5 scale
- Each of 16 MBTI types has a predefined centroid (ideal profile)
- Calculates Euclidean distance from user input to each centroid
- Returns the type with the smallest distance

```typescript
// Centroid example
CENTROIDS = {
  "INTJ": [3, 2, 4, 3],  // [Dopamine, Serotonin, Testosterone, Estrogen]
  "ENFP": [5, 2, 2, 4],
  // ... 14 more types
}
```

### Temperaments (`src/lib/scoring/temperaments.ts`)

**Method**: Variance-Based Classification with Blend Detection

- User rates 5 chemicals (Cortisol, Dopamine, Oxytocin, Serotonin, Androgenicity) on a 1-5 scale
- Each of 4 temperaments has an ideal profile
- Calculates population variance of difference between user input and each profile
- Primary = lowest variance
- If second-lowest variance is within 0.5 of lowest, shows a blend (e.g., "Choleric-Melancholic")

```typescript
// Profile example
PROFILES = {
  Choleric:    [3, 5, 1, 2, 5],  // [Cortisol, Dopamine, Oxytocin, Serotonin, Androgenicity]
  Melancholic: [5, 1, 3, 4, 1],
  Phlegmatic:  [1, 2, 5, 5, 1],
  Sanguine:    [1, 5, 3, 3, 3],
}
```

## Pages Overview

| Route | Type | Description |
|-------|------|-------------|
| `/` | Landing | Homepage with test CTAs and theory cards |
| `/mbti` | Interactive Test | 4-question MBTI assessment with results |
| `/temperaments` | Interactive Test | 5-question Temperament assessment with results |
| `/theory` | Index | Links to educational content |
| `/theory/jungian` | Educational | Jungian Typology explanation |
| `/theory/moral-alignment` | Educational | Moral Alignment explanation |
| `/theory/enneagram` | Educational | Enneagram explanation |
| `/resources` | Reference | Research links, scoring explanations, disclaimer |

## Design Constraints

- **No authentication** - No login, no user accounts
- **No database** - All scoring is client-side
- **No payments** - No pricing, no purchase flows
- **Dark theme only** - Black, white, and gray palette
- **Minimal UI** - No animations, no gamification

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

## Deployment

The site is deployed on Vercel and automatically deploys from the `main` branch.
