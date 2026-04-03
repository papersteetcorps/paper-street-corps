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
  "Your answers must be concrete and factual — things an external observer could confirm.",
  "Trying to skew answers toward a specific type will destroy the accuracy of the entire process.",
  "You can add, modify, or remove form fields to capture your experience precisely.",
  "Bad language is allowed in your answers — it will be filtered for factual content only.",
  "Blank fields are skipped automatically. Fill what you can.",
];

const STEPS = [
  { num: "01", title: "Fill life phases", desc: "Describe distinct periods of your life using structured forms — location, people, routine, and notable moments." },
  { num: "02", title: "Choose types to simulate", desc: "Pick 1-3 Enneagram types you suspect or are curious about." },
  { num: "03", title: "Watch the simulation", desc: "The engine simulates how each type would have processed your concrete life experiences." },
  { num: "04", title: "Take the quiz (optional)", desc: "If confused, a personalized quiz built from your own life data narrows it down." },
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
              <p className="text-xs text-surface-500 uppercase tracking-widest">VRDW INEE-2</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Enneagram Simulation Engine
              </h1>
              <p className="text-surface-400 leading-relaxed">
                This is not a questionnaire. You will describe real phases of your life in structured detail.
                The engine then simulates how each Enneagram type would have processed your concrete experiences —
                revealing patterns in your fixation, passion, and trap.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-sm font-medium text-surface-500 uppercase tracking-widest">How it works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STEPS.map(({ num, title, desc }, i) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex gap-4"
                  >
                    <span className="text-3xl font-bold text-surface-800 shrink-0 leading-tight">{num}</span>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{title}</h3>
                      <p className="text-xs text-surface-400 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-medium text-surface-500 uppercase tracking-widest">Rules</h2>
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
              <p className="text-xs text-surface-400 leading-relaxed">
                This engine works by simulating types against your real experiences. If you fabricate or
                skew your answers toward a type you want to be, the simulation will produce incoherent
                results and the entire process becomes unreliable. Be honest — the goal is accuracy, not flattery.
              </p>
            </motion.div>

            <section className="space-y-3">
              <h2 className="text-sm font-medium text-surface-500 uppercase tracking-widest">What is a &ldquo;phase&rdquo;?</h2>
              <p className="text-sm text-surface-400 leading-relaxed">
                A phase is any distinct period of your life that had its own lifestyle, environment, and rhythm.
                Examples: childhood at home, college years, first job, a period of illness, life abroad.
                Each phase captures where you were, who was around you, your routine, and the notable moments that stuck with you.
              </p>
              <p className="text-sm text-surface-400 leading-relaxed">
                You need at least <span className="text-foreground font-medium">one phase</span> to begin.
                More phases give the engine more material to simulate through, producing deeper and more accurate results.
              </p>
            </section>

            <div className="text-center space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={handleStartNewPhase}>
                  Begin — Fill Your First Phase
                </Button>
                {FLAGS.DEV_MODE && (
                  <Button variant="secondary" onClick={handleLoadDemo}>
                    Fill Demo Data
                  </Button>
                )}
              </div>
              <p className="text-xs text-surface-500">
                Minimum 1 phase required. You can add more after.
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
              <p className="text-xs text-surface-500 uppercase tracking-widest">VRDW INEE-2</p>
              <h2 className="text-2xl font-semibold tracking-tight">Your Life Phases</h2>
              <p className="text-sm text-surface-400">
                {savedPhases.length} phase{savedPhases.length !== 1 ? "s" : ""} added. Add more for deeper simulation, or proceed.
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
                Continue — Select Types
              </Button>
            </div>

            <p className="text-xs text-surface-500 text-center">
              More phases = more simulation material = more accurate results.
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
