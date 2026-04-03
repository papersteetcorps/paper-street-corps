"use client";

import { motion } from "motion/react";
import type { LifePhase } from "@/lib/types/enneagram";

interface PhaseCardProps {
  phase: LifePhase;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  delay?: number;
}

export default function PhaseCard({ phase, index, onEdit, onDelete, delay = 0 }: PhaseCardProps) {
  const filledMoments = phase.moments.filter((m) => m.situation.trim()).length;
  const filledSubmaps = phase.submaps.filter((s) => s.name.trim()).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border border-surface-800 rounded-2xl p-5 space-y-3 hover:border-surface-700 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-surface-500 uppercase tracking-widest">Phase {index + 1}</p>
          <h3 className="text-lg font-semibold text-foreground mt-0.5">{phase.phaseName}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-xs text-accent-blue hover:text-accent-blue/80 transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-400">
        {phase.map && <span>{phase.map}</span>}
        {phase.info.ageRange && <span>Age: {phase.info.ageRange}</span>}
        {phase.info.occupation && <span>{phase.info.occupation}</span>}
      </div>

      <div className="flex gap-3 text-xs text-surface-500">
        {filledSubmaps > 0 && <span>{filledSubmaps} submap{filledSubmaps > 1 ? "s" : ""}</span>}
        {filledMoments > 0 && <span>{filledMoments} moment{filledMoments > 1 ? "s" : ""}</span>}
        {phase.environment.locality && <span>{phase.environment.locality}</span>}
      </div>
    </motion.div>
  );
}
