"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";

const TYPES: { num: number; name: string; triad: string; fixation: string; desc: string; triadColor: string }[] = [
  { num: 8, name: "The Challenger", triad: "Gut", fixation: "Vengeance", desc: "Pursues intensity and control. Protects the vulnerable, confronts the world head-on, and sits on enormous energy others find overwhelming.", triadColor: "border-red-500/30 bg-red-500/5" },
  { num: 9, name: "The Peacemaker", triad: "Gut", fixation: "Indolence", desc: "Merges with others to avoid conflict. Forgets their own agenda, seeks comfort in routine, and maintains peace at the cost of self-assertion.", triadColor: "border-red-500/30 bg-red-500/5" },
  { num: 1, name: "The Reformer", triad: "Gut", fixation: "Resentment", desc: "Driven by an inner sense of how things should be. Holds themselves to high standards, corrects what feels wrong, and suppresses anger behind discipline.", triadColor: "border-red-500/30 bg-red-500/5" },
  { num: 2, name: "The Helper", triad: "Heart", fixation: "Flattery", desc: "Reads what others need and provides it. Builds identity around being indispensable, often unaware of their own needs beneath the giving.", triadColor: "border-amber-500/30 bg-amber-500/5" },
  { num: 3, name: "The Achiever", triad: "Heart", fixation: "Vanity", desc: "Shapes identity around success and image. Masters the art of becoming what the environment rewards, often losing the authentic self in the performance.", triadColor: "border-amber-500/30 bg-amber-500/5" },
  { num: 4, name: "The Individualist", triad: "Heart", fixation: "Melancholy", desc: "Longs for what is missing. Feels fundamentally different from others, drawn to emotional depth and authenticity, often comparing themselves unfavorably.", triadColor: "border-amber-500/30 bg-amber-500/5" },
  { num: 5, name: "The Investigator", triad: "Head", fixation: "Stinginess", desc: "Withdraws to observe and understand. Minimizes needs, hoards energy and knowledge, and processes the world through intellect before engaging.", triadColor: "border-blue-500/30 bg-blue-500/5" },
  { num: 6, name: "The Loyalist", triad: "Head", fixation: "Cowardice", desc: "Scans for threats and seeks certainty. Oscillates between trusting and questioning authority, either avoiding danger or confronting it head-on.", triadColor: "border-blue-500/30 bg-blue-500/5" },
  { num: 7, name: "The Enthusiast", triad: "Head", fixation: "Planning", desc: "Lives in future possibilities to escape present pain. Chases stimulation, reframes negatives into positives, and struggles to stay with discomfort.", triadColor: "border-blue-500/30 bg-blue-500/5" },
];

// Enneagram circle: 1-2-3-4-5-6-7-8-9-1
function areAdjacent(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  return diff === 1 || diff === 8; // diff 8 means 1&9
}

function hasAdjacentPair(types: number[]): boolean {
  for (let i = 0; i < types.length; i++) {
    for (let j = i + 1; j < types.length; j++) {
      if (areAdjacent(types[i], types[j])) return true;
    }
  }
  return false;
}

function isValidSelection(types: number[]): boolean {
  if (types.length <= 1) return true;
  return hasAdjacentPair(types);
}

function wouldBeValid(current: number[], adding: number): boolean {
  return isValidSelection([...current, adding]);
}

interface TypeSelectorProps {
  selected: number[];
  onChange: (selected: number[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function TypeSelector({ selected, onChange, onSubmit, onBack, isLoading }: TypeSelectorProps) {
  const toggle = (num: number) => {
    if (selected.includes(num)) {
      const next = selected.filter((n) => n !== num);
      onChange(next);
    } else if (selected.length < 3 && wouldBeValid(selected, num)) {
      onChange([...selected, num]);
    }
  };

  const validSelection = isValidSelection(selected);
  const canSubmit = selected.length >= 2 && validSelection;

  if (isLoading) {
    return <LoadingState message="Simulating types against your life phases" variant="simulate" accent="amber" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <p className="text-xs text-surface-500 uppercase tracking-widest">VRDW INEE-2</p>
        <h2 className="text-2xl font-semibold tracking-tight">Select Types to Simulate</h2>
        <p className="text-sm text-surface-400">
          Pick 2-3 Enneagram types you suspect or are curious about. At least two must be adjacent on the Enneagram circle (1-2-3-4-5-6-7-8-9-1).
        </p>
      </div>

      {/* Triad groups */}
      {(["Gut", "Heart", "Head"] as const).map((triad) => (
        <section key={triad} className="space-y-3">
          <h3 className="text-xs font-medium text-surface-500 uppercase tracking-widest">
            {triad} Triad {triad === "Gut" ? "(8, 9, 1)" : triad === "Heart" ? "(2, 3, 4)" : "(5, 6, 7)"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TYPES.filter((t) => t.triad === triad).map((type, i) => {
              const isSelected = selected.includes(type.num);
              const isDisabled = !isSelected && (selected.length >= 3 || (selected.length > 0 && !wouldBeValid(selected, type.num)));
              return (
                <motion.button
                  key={type.num}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  onClick={() => !isDisabled && toggle(type.num)}
                  disabled={isDisabled}
                  className={`rounded-xl border p-4 text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSelected
                      ? "border-accent-amber ring-1 ring-accent-amber/30 bg-accent-amber/5"
                      : `${type.triadColor} hover:border-surface-600`
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${isSelected ? "text-accent-amber" : "text-surface-400"}`}>
                      {type.num}
                    </span>
                    <span className="text-sm font-medium text-foreground">{type.name}</span>
                  </div>
                  <p className="text-xs text-surface-500 mt-1">{type.desc}</p>
                  <p className="text-xs text-surface-600 mt-1.5">
                    Fixation: {type.fixation}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex justify-between items-center pt-4 border-t border-surface-800">
        <Button variant="ghost" onClick={onBack} disabled={isLoading}>Back to Phases</Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-surface-500">
            {selected.length}/3 selected
            {selected.length === 1 && " — pick an adjacent type"}
          </span>
          <Button onClick={onSubmit} disabled={!canSubmit || isLoading}>
            {isLoading ? "Simulating..." : "Run Simulation"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
