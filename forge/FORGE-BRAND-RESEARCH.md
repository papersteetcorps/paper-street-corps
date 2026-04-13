# Forge Brand Research & Strategy

## Competitive Intelligence

### 16Personalities (1.52 billion tests taken)
- Source: Live scrape of 16personalities.com, April 2026
- 194M+ tests in the US alone
- 91.2% self-reported accuracy rating
- Available in 49 languages, all free
- Ranks #1 for "personality test" (287,867 monthly searches)
- 81,389 organic keywords ranked
- $7.02M/month in traffic value

**Growth drivers:**
1. Zero friction (no login, no email, no credit card)
2. Named archetypes ("The Architect" not just "INTJ") become social handles
3. Result page IS the ad (prominent share buttons, "5M shares" shown)
4. SEO flywheel (each type has its own content hub: strengths, relationships, career)
5. Community retention (forum comments, 213K shares per type page)

**Visual design:** Warm illustrated characters, soft palette, friendly tone. Signals "self-discovery game" not "psychological assessment."

### Headspace
- Source: Live scrape of headspace.com, April 2026
- Font: Custom "Headspace Apercu" (rounded geometric sans-serif)
- Primary: #0061EF (electric blue)
- Background: #F9F4F2 (warm off-white)
- Body: 18px minimum
- Border radius: 32px (pill buttons)
- Strategy: therapy present but buried. Framed as "mental health for every moment" not treatment.

### Calm
- Source: Live scrape of calm.com, April 2026
- Font: Figtree, Helvetica Neue
- Primary: #1A3E6F (deep navy)
- Gradient: #60B4E7 to #6461E0 (sky to violet)
- Body: 18px
- Border radius: 100px (full pill)
- Strategy: "sleep and meditation" before "mental health"

### Raycast
- Source: Live scrape + Playwright inspection, April 2026
- Font: Inter, weight 600 for H1 at 64px
- Background: #07080A (near-black)
- Text: #FFFFFF on dark
- Pattern: maximum darkness + high-contrast white text + 1-2 saturated accents used sparingly

### Thrad.ai
- Source: Playwright inspection, April 2026
- Font: Instrument Sans, weight 500
- Giant footer text: 151px, letter-spacing -9.5px
- Brand color: rgb(236, 82, 27) (ember orange)
- Body background: rgb(242, 237, 233) (warm cream)

### Linear
- Source: Research agent verified data, April 2026
- Background: #08090A
- Primary text: #F7F8F8 (off-white, ~19:1 contrast)
- Secondary: #D0D6E0 (~11:1 contrast)
- Link: #5E6AD2 (purple-blue)
- H1: 64px, body: 15px
- Border radius: 2px (sharp = precision)

---

## Typography & Accessibility Research

### WCAG AA Requirements (W3C specification)
- Body text (< 18pt): minimum 4.5:1 contrast ratio
- Large text (>= 18pt or >= 14pt bold): minimum 3:1
- WCAG AAA for body text: 7:1
- 18pt = approximately 24px

### Dark Mode Text Best Practices
| Element | Size | Weight | Contrast Target |
|---------|------|--------|----------------|
| Body/paragraph | 16-18px | 400 | 4.5:1 min, 7:1 ideal |
| Secondary/caption | 13-14px | 400-500 | 4.5:1 |
| Headings H1 | 32-64px | 500-700 | 3:1 min |
| UI labels/nav | 13-14px | 500 | 4.5:1 |

### Why Text Feels "Too Faint" on Dark Backgrounds
1. Using opacity-based colors instead of fixed hex values
2. Background not being true black (shifts computed color)
3. Font weight too light (300 on dark = ghostly)
4. Font size too small (< 15px on dark = faint regardless of contrast)

### Premium Dark Mode Palette Pattern (derived from Raycast, Linear, Vercel, Stripe)
- Background: #09090B (near-black, neutral)
- Surface: #111113 (+2 tone elevation)
- Border: #27272A
- Text primary: #F4F4F5 (~18:1 contrast)
- Text secondary: #A1A1AA (~5.5:1, passes AA)
- Text tertiary: #71717A (use only for hints)
- Brand accent: saturated, only on interactive elements

---

## Psychology of Shareability

### Identity Signaling Theory
- Sharing a personality type communicates identity without direct assertion
- "I'm an INTJ" signals: intelligent, analytical, independent
- Types like INFJ and INTJ are over-represented in self-reports because they signal desirable identity
- Source: Mark Snyder's self-monitoring theory, Jonah Berger's "Contagious" (social currency)

### Barnum/Forer Effect
- Personality descriptions that are specific-sounding but broadly applicable feel personally accurate
- The "freakishly accurate" feeling drives sharing
- Self-disclosure motive: "this explains me better than I could"

### What Makes Results Shareable
1. Named archetype, not a number
2. Positive framing of weaknesses
3. Career/relationship content for ongoing utility
4. Visual result card designed as shareable artifact
5. Community membership (group identity)

### Spotify Wrapped Pattern
- ~20 slides, one card at a time
- Suspense builds: partial reveals create questions
- Reframes raw data as emotional language ("788 hours finding yourself")
- Max 15 words per card
- Identity label is the share trigger

---

## Optimal Report Structure (Research-Backed)

### Source: 16Personalities profile analysis + BuzzFeed quiz research + Pointerpro assessment design

| Section | Format | Words | Hook |
|---------|--------|-------|------|
| Identity Drop | Headline + 1 sentence | 25-35 | Screenshot-able label |
| The Mirror | 2 paragraphs | 120-150 | "Freakishly accurate" moment |
| Actual Strengths | 3 mini-paragraphs | 150-200 | Specific > generic |
| Shadow Side | 2-3 paragraphs | 120-160 | Honest = high share rate |
| Real World | 3 x 50-word blocks | 150-200 | Relationships section |
| Unlocking Insight | 1 paragraph + pull quote | 80-100 | "Never seen it explained this way" |
| Next Step + Share | 2 sentences + CTA | 30-50 | Share prompt built in |

**Total: 700-900 words. 3.5-4.5 minutes at 200 wpm.**

**Three built-in share moments:**
- Section 1: Identity card (screenshot)
- Section 4: Shadow side (tag someone)
- Section 6: Unlocking insight (repost)

### Key Finding (Pointerpro/Nielsen Norman Group)
Users spend only 4.4 seconds more for each additional 100 words. Progressive disclosure (core insight first, details available) increases both completion AND sharing rates.

### BuzzFeed Quiz Results Formula
- Result description: 60-100 words maximum
- Must simultaneously: flatter, validate, differentiate
- The result functions as an identity statement the user couldn't have written themselves

---

## Forge Brand Positioning

### One-Sentence Position
"Forge is the only personality assessment that tells you who you are AND what to do about it."

### Competitive Differentiation
| Competitor | What They Do | What Forge Does Different |
|-----------|-------------|--------------------------|
| 16Personalities | Label + stop | Label + direction + action |
| Truity | Paid gate on depth, clinical | Consumer-first, conversational |
| Enneagram apps | Single framework | 6 frameworks synthesized |
| Crystal/Hogan | Enterprise, jargon, facilitators | Self-serve, accessible |

### Territory Owned
Clarity -> Direction -> Action. Every competitor stops at clarity.

### The 5 Brand Rules
1. Never tell someone what they want to hear
2. Depth over breadth, always
3. Action is the product, not the label
4. One voice, no matter the audience
5. Forge never competes with therapy, it points toward it

---

## Launch Strategy Summary

### Weeks 1-4: Controlled Seeding
- 20 personal beta users with specific ask: "screenshot result, send to one person"
- Lurk r/mbti (350k), r/enneagram (120k), r/findapath (180k)
- DM 5-8 micro-creators (5k-50k followers) in personality TikTok niche
- Create brand accounts, post insights, no product push

### Months 2-3: Soft Launch
- Reddit value posts (insight first, link second)
- TikTok 4x/week: type-in-crisis, fictional characters, raw reactions
- Product Hunt on a Tuesday
- Target: 500 users, 10% sharing result cards

### Months 4-6: Growth Engine
- SEO: own "MBTI + Enneagram combination" queries
- Referral: "compare with a friend" feature
- Meta ads $20/day, CAC target under $1.50
- Podcast seeding with niche psychology shows

### Months 6-9: B2B Introduction
- "Forge Teams" as extension, not separate brand
- Start with productized consulting ($500-1,500 per team session)
- Annual license $2,000-5,000 per team of 10-25

### Pricing Model
- FREE: Full assessment (all 6 frameworks) + result profile + shareable card
- PAID ($9.99/mo or $79/yr): Growth roadmap, progress tracking, voice AI, PDF export, comparative analysis
- NEVER GATE: The assessment itself. Gating kills the viral loop.

---

## Sources

- 16Personalities.com (live scrape, April 2026)
- Headspace.com (live scrape, April 2026)
- Calm.com (live scrape, April 2026)
- Raycast.com (Playwright inspection, April 2026)
- Thrad.ai (Playwright inspection, April 2026)
- Linear.app (verified brand data, April 2026)
- W3C WCAG 2.1/2.2 Specification
- Spotify Wrapped 2025 UX Analysis (UX Playbook)
- Pointerpro Assessment Report Personalization Research
- Hinge Profile Psychology Analysis (Datemaxx)
- BuzzFeed Personality Quiz Internal Guide
- LeadQuizzes Viral Quiz Research
- Mark Snyder, Self-Monitoring Theory
- Jonah Berger, "Contagious" (Social Currency Framework)
- Nielsen Norman Group, Progressive Disclosure Research
