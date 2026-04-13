"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PhaseForm from "@/components/enneagram/PhaseForm";
import PhaseCard from "@/components/enneagram/PhaseCard";
import TypeSelector from "@/components/enneagram/TypeSelector";
import SimulationResults, { type EnneagramSimulation } from "@/components/enneagram/SimulationResults";
import QuizView from "@/components/enneagram/QuizView";
import QuizResult from "@/components/enneagram/QuizResult";
import { createEmptyPhase, phaseToPayload, type LifePhase } from "@/lib/types/enneagram";
import { saveResult } from "@/lib/results-store";
import { FLAGS } from "@/lib/flags";

async function loadSamplePhases(): Promise<LifePhase[]> {
  const res = await fetch("/enneagram-data/sample-phases.json");
  const raw = (await res.json()) as Array<Record<string, unknown>>;
  return raw.map((p) => ({
    id: crypto.randomUUID(),
    phaseName: (p.phaseName as string) ?? "",
    map: (p.map as string) ?? "",
    submaps: (p.submaps as LifePhase["submaps"]) ?? [],
    info: p.info as LifePhase["info"],
    lifestyle: p.lifestyle as LifePhase["lifestyle"],
    environment: p.environment as LifePhase["environment"],
    moments: (p.moments as LifePhase["moments"]) ?? [{ situation: "", conclusion: "" }],
  }));
}

type ViewPhase = "intro" | "form" | "review" | "type-select" | "simulation" | "quiz" | "result";

const RULES = [
  "Be specific. Answers must describe things an outside observer could confirm.",
  "Skip fields you can't answer. Blank fields are ignored automatically.",
  "Add, remove, or rename form fields to fit your experience.",
  "Strong language is fine. Only factual content is used.",
  "Don't steer toward a type. It breaks the results.",
];

const STEPS = [
  { num: "01", title: "Fill life phases", desc: "Write about distinct periods of your life: where you were, who was around, your routine, what stuck with you." },
  { num: "02", title: "Choose types to test", desc: "Pick 1 to 3 Enneagram types you suspect or want to rule out." },
  { num: "03", title: "See how each type fits", desc: "Each type is run against your actual experiences. You see where it fits and where it breaks down." },
  { num: "04", title: "Take the quiz if still unsure", desc: "A short quiz built from your own life data helps narrow it down. Optional, but useful when two types are close." },
];

export default function EnneagramPage() {
  const [viewPhase, setViewPhase] = useState<ViewPhase>("intro");
  const [savedPhases, setSavedPhases] = useState<LifePhase[]>([]);
  const [editingPhase, setEditingPhase] = useState<LifePhase | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [simulation, setSimulation] = useState<EnneagramSimulation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [quizWinner, setQuizWinner] = useState<number | null>(null);
  const [quizTally, setQuizTally] = useState<Record<number, number>>({});
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  const STORAGE_KEY = "psc-draft-enneagram";

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as LifePhase[];
        if (Array.isArray(data) && data.length > 0) {
          setSavedPhases(data);
          setViewPhase("review");
        }
      }
    } catch { /* silent */ }
    setHasCheckedStorage(true);
  }, []);

  // Persist phases to localStorage on every change
  useEffect(() => {
    if (!hasCheckedStorage) return;
    try {
      if (savedPhases.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPhases));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* silent */ }
  }, [savedPhases, hasCheckedStorage]);

  const handleLoadDemo = useCallback(async () => {
    try {
      const phases = await loadSamplePhases();
      setSavedPhases(phases);
      setViewPhase("review");
    } catch {
      // silent — button just won't work
    }
  }, []);

  const handleStartNewPhase = useCallback(() => {
    setEditingPhase(createEmptyPhase());
    setEditingIndex(savedPhases.length);
    setViewPhase("form");
  }, [savedPhases.length]);

  const handleEditPhase = useCallback((index: number) => {
    setEditingPhase({ ...savedPhases[index] });
    setEditingIndex(index);
    setViewPhase("form");
  }, [savedPhases]);

  const handleDeletePhase = useCallback((index: number) => {
    setSavedPhases((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSavePhase = useCallback(() => {
    if (!editingPhase) return;
    setSavedPhases((prev) => {
      const next = [...prev];
      if (editingIndex < prev.length) {
        next[editingIndex] = editingPhase;
      } else {
        next.push(editingPhase);
      }
      return next;
    });
    setEditingPhase(null);
    setEditingIndex(-1);
    setViewPhase("review");
  }, [editingPhase, editingIndex]);

  const handleCancelForm = useCallback(() => {
    setEditingPhase(null);
    setEditingIndex(-1);
    setViewPhase(savedPhases.length > 0 ? "review" : "intro");
  }, [savedPhases.length]);

  const handleRunSimulation = useCallback(async () => {
    if (selectedTypes.length === 0 || savedPhases.length === 0) return;
    setIsSimulating(true);
    try {
      const phases = savedPhases.map(phaseToPayload);
      const res = await fetch("/api/enneagram-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phases, selectedTypes }),
      });
      const data = await res.json();
      if (data.simulation) {
        setSimulation(data.simulation);
        saveResult("enneagram", data.simulation);
        setViewPhase("simulation");
      } else {
        setSimulation({
          headline: "Simulation complete",
          summary: data.error || "Could not generate simulation. Check ANTHROPIC_API_KEY.",
        });
        setViewPhase("simulation");
      }
    } catch {
      setSimulation({
        headline: "Error",
        summary: "Could not reach the simulation service.",
      });
      setViewPhase("simulation");
    } finally {
      setIsSimulating(false);
    }
  }, [selectedTypes, savedPhases]);

  const handleQuizResult = useCallback((winner: number, tally: Record<number, number>) => {
    setQuizWinner(winner);
    setQuizTally(tally);
    setViewPhase("result");
  }, []);

  const handleReset = useCallback(() => {
    setSavedPhases([]);
    setEditingPhase(null);
    setEditingIndex(-1);
    setSelectedTypes([]);
    setSimulation(null);
    setQuizWinner(null);
    setQuizTally({});
    setViewPhase("intro");
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* silent */ }
  }, []);

  return (
    <Container className="py-8">
      <AnimatePresence mode="wait">
        {/* ── Intro ──────────────────────────────────────────────── */}
        {viewPhase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto space-y-10"
          >
            <div className="text-center space-y-4">
              <p className="text-sm text-surface-400 uppercase tracking-widest font-medium">Enneagram</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Enneagram
              </h1>
              <p className="text-surface-300 text-base leading-relaxed">
                Describe real phases of your life. Each Enneagram type is then tested against your actual
                experiences, showing you where the pattern fits and where it doesn&rsquo;t. No multiple choice.
                No self-report bias.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-widest">How it works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STEPS.map(({ num, title, desc }, i) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex gap-4"
                  >
                    <span className="text-3xl font-bold text-surface-600 shrink-0 leading-tight">{num}</span>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{title}</h3>
                      <p className="text-sm text-surface-300 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-widest">Rules</h2>
              <div className="border border-surface-800 rounded-2xl p-5 space-y-3">
                {RULES.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex gap-3 text-sm"
                  >
                    <span className="text-surface-600 shrink-0">&#8226;</span>
                    <span className="text-surface-300">{rule}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="border border-amber-500/20 bg-amber-500/5 rounded-2xl px-5 py-4"
            >
              <p className="text-sm text-amber-400/90 font-medium mb-1">Important</p>
              <p className="text-sm text-surface-300 leading-relaxed">
                Be honest. Write what actually happened, not what sounds meaningful.
                Fabricated or shaped answers produce incoherent results. Accuracy is the point, not flattery.
              </p>
            </motion.div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-surface-300 uppercase tracking-widest">What is a &ldquo;phase&rdquo;?</h2>
              <p className="text-sm text-surface-300 leading-relaxed">
                A phase is any stretch of your life with its own distinct rhythm. Childhood, college, first job,
                a period of illness, time abroad. You describe where you were, who was around you, your daily
                routine, and the moments that left a mark.
              </p>
              <p className="text-sm text-surface-300 leading-relaxed">
                Start with <span className="text-foreground font-medium">one phase.</span> Add more for better
                results. More material means more to test each type against.
              </p>
            </section>

            <div className="text-center space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={handleStartNewPhase}>
                  Begin: Fill Your First Phase
                </Button>
                {FLAGS.DEV_MODE && (
                  <Button variant="secondary" onClick={handleLoadDemo}>
                    Fill Demo Data
                  </Button>
                )}
              </div>
              <p className="text-sm text-surface-400">
                Start with one phase. Add more once you&rsquo;re in.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Phase Form ─────────────────────────────────────────── */}
        {viewPhase === "form" && editingPhase && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <PhaseForm
              phase={editingPhase}
              onChange={setEditingPhase}
              onSave={handleSavePhase}
              onCancel={handleCancelForm}
              phaseIndex={editingIndex}
              previousPhase={editingIndex > 0 ? savedPhases[editingIndex - 1] ?? null : null}
            />
          </motion.div>
        )}

        {/* ── Review ─────────────────────────────────────────────── */}
        {viewPhase === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="text-center space-y-2">
              <p className="text-xs text-surface-500 uppercase tracking-widest">Enneagram</p>
              <h2 className="text-2xl font-semibold tracking-tight">Your Life Phases</h2>
              <p className="text-sm text-surface-400">
                {savedPhases.length} phase{savedPhases.length !== 1 ? "s" : ""} added. Add more for better results, or continue.
              </p>
            </div>

            <div className="space-y-4">
              {savedPhases.map((phase, i) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  index={i}
                  onEdit={() => handleEditPhase(i)}
                  onDelete={() => handleDeletePhase(i)}
                  delay={i * 0.05}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-surface-800">
              <Button variant="secondary" onClick={handleStartNewPhase}>
                + Add Another Phase
              </Button>
              <Button onClick={() => setViewPhase("type-select")} disabled={savedPhases.length === 0}>
                Continue: Select Types
              </Button>
            </div>

            <p className="text-xs text-surface-500 text-center">
              More phases give each type more to work with. Results improve with depth.
            </p>
          </motion.div>
        )}

        {/* ── Type Selection ────────────────────────────────────── */}
        {viewPhase === "type-select" && (
          <motion.div
            key="type-select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <TypeSelector
              selected={selectedTypes}
              onChange={setSelectedTypes}
              onSubmit={handleRunSimulation}
              onBack={() => setViewPhase("review")}
              isLoading={isSimulating}
            />
          </motion.div>
        )}

        {/* ── Simulation Results ──────────────────────────────────── */}
        {viewPhase === "simulation" && simulation && (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <SimulationResults
              simulation={simulation}
              phases={savedPhases.map(phaseToPayload)}
              onQuiz={() => setViewPhase("quiz")}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {/* ── Quiz ────────────────────────────────────────────────── */}
        {viewPhase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <QuizView
              phases={savedPhases}
              comparedTypes={selectedTypes}
              onResult={handleQuizResult}
              onBack={() => setViewPhase("simulation")}
            />
          </motion.div>
        )}

        {/* ── Quiz Result ────────────────────────────────────────── */}
        {viewPhase === "result" && quizWinner && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <QuizResult
              winnerType={quizWinner}
              tally={quizTally}
              comparedTypes={selectedTypes}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
