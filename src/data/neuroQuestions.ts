// data/neuroQuestions.ts
import { Chemical } from "@/lib/scoring/neurochemicalMBTI";

export const QUESTIONS: {
  text: string;
  weights: Partial<Record<Chemical, number>>;
}[] = [
  { text: "[DOPAMINE (D)]: I seek novelty, excitement, and new ideas.", weights: { dopamine: 1 } },
  { text: "[SEROTONIN (S)]: I prefer structure, predictability, and routine.", weights: { serotonin: 1 } },
  { text: "[NOREPINEPHRINE (N)]: I remain calm and decisive under pressure.", weights: { norepinephrine: 1 } },
  { text: "[ACETYLCHOLINE (A)]: I enjoy deep focus, abstract thinking, and analysis.", weights: { acetylcholine: 1 } },
  { text: "[OXYTOCIN (O)]: I am highly sensitive to others’ emotions.", weights: { oxytocin: 1 } },
  {
    text: "[0.7D + 0.3N]: I act quickly when opportunities appear.",
    weights: { dopamine: 0.7, norepinephrine: 0.3 },
  },
  {
    text: "[0.7O + 0.3S]: I value harmony and emotional connection.",
    weights: { oxytocin: 0.7, serotonin: 0.3 },
  },
];
