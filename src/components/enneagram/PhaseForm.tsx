"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LifePhase, Submap, Moment } from "@/lib/types/enneagram";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import { useVoiceInput } from "@/lib/hooks/useVoiceInput";

interface PhaseFormProps {
  phase: LifePhase;
  onChange: (phase: LifePhase) => void;
  onSave: () => void;
  onCancel: () => void;
  phaseIndex: number;
  previousPhase?: LifePhase | null;
}

/* ── Tiny reusable pieces ──────────────────────────────────────────────── */

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2.5 text-base text-foreground placeholder:text-surface-400 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2.5 text-base text-foreground placeholder:text-surface-400 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all resize-y"
    />
  );
}

function MicTextArea({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const baseRef = useRef(value);
  const { listening, supported, start, stop } = useVoiceInput();

  const toggleMic = useCallback(() => {
    if (listening) {
      stop();
      return;
    }
    baseRef.current = value;
    start((transcript) => {
      const base = baseRef.current;
      const sep = base && !base.endsWith(" ") ? " " : "";
      onChange(base + sep + transcript);
    });
  }, [listening, value, start, stop, onChange]);

  // Keep baseRef in sync when user types manually
  if (!listening && value !== baseRef.current) {
    baseRef.current = value;
  }

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => { baseRef.current = e.target.value; onChange(e.target.value); }}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2.5 pr-12 text-base text-foreground placeholder:text-surface-400 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all resize-y"
      />
      {supported && (
        <button
          type="button"
          onClick={toggleMic}
          className={`absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-md transition-all ${
            listening
              ? "bg-red-500/20 text-red-400 animate-pulse"
              : "bg-surface-800 text-surface-500 hover:text-surface-300 hover:bg-surface-700"
          }`}
          aria-label={listening ? "Stop recording" : "Start voice input"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {listening ? (
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
            ) : (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </>
            )}
          </svg>
        </button>
      )}
    </div>
  );
}

function FieldLabel({ children, hint, required }: { children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-medium text-surface-200">
        {children}
        {required && <span className="text-accent-amber ml-0.5">*</span>}
      </span>
      {hint && <p className="text-sm text-surface-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function TagList({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <Input
            value={item}
            onChange={(v) => { const next = [...items]; next[i] = v; onChange(next); }}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="mt-2.5 text-surface-600 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
            aria-label="Remove"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-xs text-accent-amber/70 hover:text-accent-amber transition-colors cursor-pointer flex items-center gap-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add entry
      </button>
    </div>
  );
}

/* ── Section accordion ─────────────────────────────────────────────────── */

interface SectionProps {
  id: string;
  title: string;
  icon: string;
  filledCount: number;
  totalCount: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, icon, filledCount, totalCount, isOpen, onToggle, children }: SectionProps) {
  const progress = totalCount > 0 ? filledCount / totalCount : 0;
  const isDone = filledCount > 0;

  return (
    <div className={`border rounded-2xl transition-colors ${isOpen ? "border-surface-700 bg-surface-900/30" : "border-surface-800"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer"
      >
        <span className="text-lg">{icon}</span>
        <div className="flex-1 text-left">
          <span className="text-sm font-medium text-foreground">{title}</span>
          {!isOpen && isDone && (
            <span className="text-xs text-surface-500 ml-2">{filledCount}/{totalCount} filled</span>
          )}
        </div>
        {isDone && !isOpen && (
          <span className="w-5 h-5 rounded-full bg-accent-amber/15 flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-amber)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
        {isOpen && totalCount > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-1.5 bg-surface-800 rounded-full overflow-hidden">
              <div className="h-full bg-accent-amber/60 rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
            <span className="text-xs text-surface-500">{filledCount}/{totalCount}</span>
          </div>
        )}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-surface-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Count helpers ─────────────────────────────────────────────────────── */

function countBasics(p: LifePhase) {
  let filled = 0;
  const total = 4;
  if (p.phaseName.trim()) filled++;
  if (p.map.trim()) filled++;
  if (p.info.ageRange.trim()) filled++;
  if (p.info.occupation.trim()) filled++;
  return { filled, total };
}

function countLifestyle(p: LifePhase) {
  let filled = 0;
  const total = 3;
  if (p.lifestyle.routine.some(Boolean)) filled++;
  if (p.lifestyle.facilities.some(Boolean)) filled++;
  if (p.lifestyle.scarcity.some(Boolean)) filled++;
  return { filled, total };
}

function countEnvironment(p: LifePhase) {
  let filled = 0;
  const total = 7;
  if (p.environment.locality.trim()) filled++;
  if (p.environment.people.guardianRelation.some(Boolean)) filled++;
  if (p.environment.people.siblingRelation.some(Boolean)) filled++;
  if (p.environment.people.friendsRelation.some(Boolean)) filled++;
  if (p.environment.people.mentorRelation.some(Boolean)) filled++;
  if (p.environment.society.elements.some(Boolean)) filled++;
  if (p.environment.society.societalValues.some(Boolean)) filled++;
  return { filled, total };
}

function countMoments(p: LifePhase) {
  const filled = p.moments.filter((m) => m.situation.trim()).length;
  return { filled, total: Math.max(1, p.moments.length) };
}

/* ── Main form ─────────────────────────────────────────────────────────── */

const SECTIONS = ["basics", "submaps", "lifestyle", "environment", "moments"] as const;
type SectionId = typeof SECTIONS[number];

export default function PhaseForm({ phase, onChange, onSave, onCancel, phaseIndex, previousPhase }: PhaseFormProps) {
  const [openSection, setOpenSection] = useState<SectionId>("basics");
  const [freeText, setFreeText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [inputOpen, setInputOpen] = useState<"none" | "text" | "voice">("none");
  const [showGuide, setShowGuide] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const speech = useVoiceInput();

  const toggle = (id: SectionId) => setOpenSection((prev) => (prev === id ? prev : id));

  const update = useCallback(
    (patch: Partial<LifePhase>) => onChange({ ...phase, ...patch }),
    [phase, onChange]
  );
  const updateInfo = useCallback(
    (patch: Partial<LifePhase["info"]>) => update({ info: { ...phase.info, ...patch } }),
    [phase.info, update]
  );
  const updateLifestyle = useCallback(
    (patch: Partial<LifePhase["lifestyle"]>) => update({ lifestyle: { ...phase.lifestyle, ...patch } }),
    [phase.lifestyle, update]
  );
  const updateEnv = useCallback(
    (patch: Partial<LifePhase["environment"]>) => update({ environment: { ...phase.environment, ...patch } }),
    [phase.environment, update]
  );
  const updatePeople = useCallback(
    (patch: Partial<LifePhase["environment"]["people"]>) => updateEnv({ people: { ...phase.environment.people, ...patch } }),
    [phase.environment.people, updateEnv]
  );
  const updateSociety = useCallback(
    (patch: Partial<LifePhase["environment"]["society"]>) => updateEnv({ society: { ...phase.environment.society, ...patch } }),
    [phase.environment.society, updateEnv]
  );
  const updateSubmap = useCallback(
    (index: number, patch: Partial<Submap>) => {
      const next = phase.submaps.map((s, i) => (i === index ? { ...s, ...patch } : s));
      update({ submaps: next });
    },
    [phase.submaps, update]
  );
  const updateMoment = useCallback(
    (index: number, patch: Partial<Moment>) => {
      const next = phase.moments.map((m, i) => (i === index ? { ...m, ...patch } : m));
      update({ moments: next });
    },
    [phase.moments, update]
  );

  const handleExtract = useCallback(async () => {
    if (!freeText.trim()) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/enneagram-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: freeText }),
      });
      const data = await res.json();
      if (data.extracted) {
        const e = data.extracted;
        onChange({
          ...phase,
          phaseName: e.phaseName || phase.phaseName,
          map: e.map || phase.map,
          submaps: e.submaps?.length ? e.submaps : phase.submaps,
          info: {
            ageRange: e.info?.ageRange || phase.info.ageRange,
            occupation: e.info?.occupation || phase.info.occupation,
            illness: e.info?.illness?.length ? e.info.illness : phase.info.illness,
          },
          lifestyle: {
            routine: e.lifestyle?.routine?.length ? e.lifestyle.routine : phase.lifestyle.routine,
            facilities: e.lifestyle?.facilities?.length ? e.lifestyle.facilities : phase.lifestyle.facilities,
            scarcity: e.lifestyle?.scarcity?.length ? e.lifestyle.scarcity : phase.lifestyle.scarcity,
          },
          environment: {
            locality: e.environment?.locality || phase.environment.locality,
            people: {
              guardianRelation: e.environment?.people?.guardianRelation?.length ? e.environment.people.guardianRelation : phase.environment.people.guardianRelation,
              siblingRelation: e.environment?.people?.siblingRelation?.length ? e.environment.people.siblingRelation : phase.environment.people.siblingRelation,
              friendsRelation: e.environment?.people?.friendsRelation?.length ? e.environment.people.friendsRelation : phase.environment.people.friendsRelation,
              mentorRelation: e.environment?.people?.mentorRelation?.length ? e.environment.people.mentorRelation : phase.environment.people.mentorRelation,
            },
            society: {
              elements: e.environment?.society?.elements?.length ? e.environment.society.elements : phase.environment.society.elements,
              societalValues: e.environment?.society?.societalValues?.length ? e.environment.society.societalValues : phase.environment.society.societalValues,
            },
          },
          moments: e.moments?.length ? e.moments : phase.moments,
        });
        setExtracted(true);
        setInputOpen("none");
      }
    } catch { /* silent */ }
    finally { setExtracting(false); }
  }, [freeText, phase, onChange]);

  const handleCarryForward = useCallback(() => {
    if (!previousPhase) return;
    onChange({
      ...phase,
      map: phase.map || previousPhase.map,
      environment: {
        ...phase.environment,
        locality: phase.environment.locality || previousPhase.environment.locality,
        people: {
          guardianRelation: phase.environment.people.guardianRelation.length ? phase.environment.people.guardianRelation : previousPhase.environment.people.guardianRelation,
          siblingRelation: phase.environment.people.siblingRelation.length ? phase.environment.people.siblingRelation : previousPhase.environment.people.siblingRelation,
          friendsRelation: phase.environment.people.friendsRelation.length ? phase.environment.people.friendsRelation : previousPhase.environment.people.friendsRelation,
          mentorRelation: phase.environment.people.mentorRelation.length ? phase.environment.people.mentorRelation : previousPhase.environment.people.mentorRelation,
        },
        society: {
          elements: phase.environment.society.elements.length ? phase.environment.society.elements : previousPhase.environment.society.elements,
          societalValues: phase.environment.society.societalValues.length ? phase.environment.society.societalValues : previousPhase.environment.society.societalValues,
        },
      },
    });
  }, [previousPhase, phase, onChange]);

  const basics = countBasics(phase);
  const lifestyle = countLifestyle(phase);
  const environment = countEnvironment(phase);
  const moments = countMoments(phase);
  const submapCount = phase.submaps.filter((s) => s.name.trim()).length;

  const totalFilled = basics.filled + lifestyle.filled + environment.filled + moments.filled + (submapCount > 0 ? 1 : 0);
  const totalFields = basics.total + lifestyle.total + environment.total + moments.total + 1;

  const canSave = phase.phaseName.trim().length > 0;

  const goNext = () => {
    const idx = SECTIONS.indexOf(openSection);
    if (idx < SECTIONS.length - 1) setOpenSection(SECTIONS[idx + 1]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-sm text-surface-400 uppercase tracking-widest font-medium">Phase {phaseIndex + 1}</p>
        <h2 className="text-2xl font-semibold tracking-tight">Describe this period of your life</h2>
      </div>

      {/* ── Quick input: action buttons + expandable cards ───── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        {/* Action buttons row */}
        <div className="flex gap-2">
          <button
            onClick={() => setInputOpen(inputOpen === "text" ? "none" : "text")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
              inputOpen === "text" ? "border-accent-amber/40 bg-accent-amber/5 text-accent-amber" : "border-surface-800 text-surface-400 hover:border-surface-600 hover:text-surface-300"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            Write
          </button>
          {speech.supported && (
            <button
              onClick={() => setInputOpen(inputOpen === "voice" ? "none" : "voice")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                inputOpen === "voice" ? "border-accent-amber/40 bg-accent-amber/5 text-accent-amber" : "border-surface-800 text-surface-400 hover:border-surface-600 hover:text-surface-300"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              Speak
            </button>
          )}
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
              showGuide ? "border-surface-600 bg-surface-800/50 text-surface-300" : "border-surface-800 text-surface-500 hover:border-surface-600 hover:text-surface-300"
            }`}
            title="What should I talk about?"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </button>
        </div>

        {/* Guide panel */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border border-surface-800 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-medium text-surface-200">What to include in your description:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { q: "Where were you?", eg: "London, a quiet suburb, college campus" },
                    { q: "How old? What were you doing?", eg: "14-18, school student" },
                    { q: "Who was around you?", eg: "Strict dad, caring mum, 2-3 close friends" },
                    { q: "What was daily life like?", eg: "School till 3, alone in evenings, no internet" },
                    { q: "Any key moments that stuck?", eg: "Won a competition but felt empty, lost a friend" },
                    { q: "What was the social atmosphere?", eg: "Conservative, status-driven, close community" },
                  ].map(({ q, eg }) => (
                    <div key={q} className="flex gap-2 text-sm">
                      <span className="text-accent-amber/60 mt-0.5 shrink-0">&#8250;</span>
                      <div>
                        <span className="text-surface-300">{q}</span>
                        <span className="text-surface-400 ml-1">e.g. {eg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Write card */}
        <AnimatePresence>
          {inputOpen === "text" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border border-accent-amber/20 bg-accent-amber/5 rounded-2xl p-5 space-y-3">
                {extracting ? (
                  <div className="py-6">
                    <LoadingState compact message="Extracting details from your text..." accent="amber" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-surface-400">Describe this phase in your own words. We&rsquo;ll fill the form automatically.</p>
                    <textarea
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      placeholder={"I was 14-18, living in London with my mum. Dad had left when I was 10. Went to a school in Hackney, mostly hung out with 2-3 close mates. Mum worked long hours so I was alone a lot. Biggest memory: getting into a fight and realising nobody came to help. Another: spending an entire summer reading alone and feeling more alive than I had all year."}
                      rows={5}
                      className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2.5 text-base text-foreground placeholder:text-surface-400 focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all resize-y"
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-surface-400">You can edit everything after.</p>
                      <Button onClick={handleExtract} disabled={!freeText.trim()}>Extract &amp; Fill Form</Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice card */}
        <AnimatePresence>
          {inputOpen === "voice" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border border-accent-amber/20 bg-accent-amber/5 rounded-2xl p-5 space-y-4">
                <p className="text-sm text-surface-400">Talk naturally about this phase — where you lived, who was around, your routine, and moments that stuck with you.</p>

                {/* Mic + transcript */}
                <div className="flex gap-4 items-start">
                  <button
                    onClick={() => {
                      if (speech.listening) { speech.stop(); } else { speech.start((text) => setFreeText(text)); }
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      speech.listening
                        ? "bg-red-500/20 border-2 border-red-500"
                        : "bg-surface-800 border-2 border-surface-700 hover:border-accent-amber/50"
                    }`}
                  >
                    {speech.listening ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                      </motion.div>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-h-[56px]">
                    {freeText ? (
                      speech.listening ? (
                        <div className="border border-surface-800 rounded-lg p-3 max-h-32 overflow-y-auto bg-surface-900">
                          <p className="text-sm text-surface-300 leading-relaxed">{freeText}</p>
                        </div>
                      ) : (
                        <textarea
                          value={freeText}
                          onChange={(e) => setFreeText(e.target.value)}
                          rows={4}
                          className="w-full bg-surface-900 border border-surface-700 rounded-lg p-3 text-sm text-surface-200 leading-relaxed focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/20 transition-all resize-y"
                        />
                      )
                    ) : (
                      <div className="flex items-center h-14 text-sm text-surface-400">
                        {speech.listening ? (
                          <span className="flex items-center gap-2">
                            <motion.span className="w-2 h-2 rounded-full bg-red-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                            Listening... speak naturally
                          </span>
                        ) : "Tap the mic to start recording"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Voice error */}
                {speech.error && (
                  <p className="text-sm text-red-400">{speech.error}</p>
                )}

                {/* Extract button (after stopping) */}
                {freeText && !speech.listening && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
                    <p className="text-sm text-surface-400">Review above, then extract.</p>
                    {extracting ? (
                      <LoadingState compact message="Extracting..." accent="amber" />
                    ) : (
                      <Button onClick={handleExtract} disabled={!freeText.trim()}>Extract &amp; Fill Form</Button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* After extraction — reopen */}
        {extracted && (
          <button
            onClick={() => { setExtracted(false); setInputOpen("text"); }}
            className="text-sm text-accent-amber/70 hover:text-accent-amber transition-colors cursor-pointer flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            Describe more or re-extract
          </button>
        )}
      </motion.div>

      {/* Carry forward from previous phase */}
      {previousPhase && totalFilled <= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-surface-800 rounded-xl px-4 py-3 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-surface-400">
              Carry forward location &amp; relationships from <span className="text-surface-300 font-medium">{previousPhase.phaseName}</span>?
            </p>
          </div>
          <button
            onClick={handleCarryForward}
            className="text-xs text-accent-amber hover:text-accent-amber/80 transition-colors cursor-pointer shrink-0 ml-3"
          >
            Apply
          </button>
        </motion.div>
      )}

      {/* Overall progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-amber/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(totalFilled / totalFields) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-surface-500 shrink-0">{totalFilled}/{totalFields} fields</span>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {/* ── Basics ───────────────────────────────────────────── */}
        <Section id="basics" title="Basics" icon="&#9673;" filledCount={basics.filled} totalCount={basics.total} isOpen={openSection === "basics"} onToggle={() => toggle("basics")}>
          <div className="space-y-4">
            <div>
              <FieldLabel required hint="A unique name for this life period">Phase Name</FieldLabel>
              <Input value={phase.phaseName} onChange={(v) => update({ phaseName: v })} placeholder="e.g. High school, First job abroad" />
            </div>
            <div>
              <FieldLabel hint="Where you were living">Location</FieldLabel>
              <Input value={phase.map} onChange={(v) => update({ map: v })} placeholder="e.g. Mumbai, New York" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Age Range</FieldLabel>
                <Input value={phase.info.ageRange} onChange={(v) => updateInfo({ ageRange: v })} placeholder="e.g. 18-22" />
              </div>
              <div>
                <FieldLabel>Occupation</FieldLabel>
                <Input value={phase.info.occupation} onChange={(v) => updateInfo({ occupation: v })} placeholder="e.g. Student" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={goNext}>Next: Places &rarr;</Button>
            </div>
          </div>
        </Section>

        {/* ── Submaps ──────────────────────────────────────────── */}
        <Section id="submaps" title="Places" icon="&#9678;" filledCount={submapCount} totalCount={Math.max(1, phase.submaps.length)} isOpen={openSection === "submaps"} onToggle={() => toggle("submaps")}>
          <div className="space-y-3">
            <p className="text-xs text-surface-500">Specific places you regularly spent time at during this phase.</p>
            {phase.submaps.map((sub, i) => (
              <div key={i} className="bg-surface-900 border border-surface-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-surface-500">Place {i + 1}</span>
                  <button onClick={() => update({ submaps: phase.submaps.filter((_, j) => j !== i) })} className="text-surface-600 hover:text-red-400 transition-colors cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <Input value={sub.name} onChange={(v) => updateSubmap(i, { name: v })} placeholder="e.g. School, Office, Gym" />
                <div className="grid grid-cols-2 gap-3">
                  <Input value={sub.slice} onChange={(v) => updateSubmap(i, { slice: v })} placeholder="When? e.g. Mornings" />
                  <Input value={sub.frequency} onChange={(v) => updateSubmap(i, { frequency: v })} placeholder="How often? e.g. Daily" />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => update({ submaps: [...phase.submaps, { name: "", slice: "", frequency: "" }] })}
              className="w-full border border-dashed border-surface-700 rounded-xl py-3 text-xs text-surface-500 hover:text-accent-amber hover:border-accent-amber/30 transition-colors cursor-pointer"
            >
              + Add a place
            </button>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={goNext}>Next: Lifestyle &rarr;</Button>
            </div>
          </div>
        </Section>

        {/* ── Lifestyle ────────────────────────────────────────── */}
        <Section id="lifestyle" title="Lifestyle" icon="&#9670;" filledCount={lifestyle.filled} totalCount={lifestyle.total} isOpen={openSection === "lifestyle"} onToggle={() => toggle("lifestyle")}>
          <div className="space-y-4">
            <div>
              <FieldLabel hint="What your typical day looked like">Daily Routine</FieldLabel>
              <TagList items={phase.lifestyle.routine} onChange={(v) => updateLifestyle({ routine: v })} placeholder="e.g. Woke at 6, school till 3, played outside" />
            </div>
            <div>
              <FieldLabel hint="Exceptional advantages you had">Facilities</FieldLabel>
              <TagList items={phase.lifestyle.facilities} onChange={(v) => updateLifestyle({ facilities: v })} placeholder="e.g. Supportive family, own room" />
            </div>
            <div>
              <FieldLabel hint="Things you notably lacked">Scarcity</FieldLabel>
              <TagList items={phase.lifestyle.scarcity} onChange={(v) => updateLifestyle({ scarcity: v })} placeholder="e.g. No internet, financial stress" />
            </div>
            <div>
              <FieldLabel hint="Any chronic conditions">Illness</FieldLabel>
              <TagList items={phase.info.illness} onChange={(v) => updateInfo({ illness: v })} placeholder="e.g. Anxiety, back pain" />
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={goNext}>Next: Environment &rarr;</Button>
            </div>
          </div>
        </Section>

        {/* ── Environment ──────────────────────────────────────── */}
        <Section id="environment" title="Environment & People" icon="&#9672;" filledCount={environment.filled} totalCount={environment.total} isOpen={openSection === "environment"} onToggle={() => toggle("environment")}>
          <div className="space-y-4">
            <div>
              <FieldLabel hint="One word or phrase for your surroundings">Locality</FieldLabel>
              <Input value={phase.environment.locality} onChange={(v) => updateEnv({ locality: v })} placeholder="e.g. Quiet suburb, dense urban" />
            </div>
            <div className="border-t border-surface-800 pt-3 space-y-3">
              <p className="text-xs font-medium text-surface-400">Relationships</p>
              <div>
                <FieldLabel>Guardians</FieldLabel>
                <TagList items={phase.environment.people.guardianRelation} onChange={(v) => updatePeople({ guardianRelation: v })} placeholder="e.g. Strict father, warm mother" />
              </div>
              <div>
                <FieldLabel>Siblings</FieldLabel>
                <TagList items={phase.environment.people.siblingRelation} onChange={(v) => updatePeople({ siblingRelation: v })} placeholder="e.g. Close with older brother" />
              </div>
              <div>
                <FieldLabel>Friends</FieldLabel>
                <TagList items={phase.environment.people.friendsRelation} onChange={(v) => updatePeople({ friendsRelation: v })} placeholder="e.g. Small tight group" />
              </div>
              <div>
                <FieldLabel>Mentors</FieldLabel>
                <TagList items={phase.environment.people.mentorRelation} onChange={(v) => updatePeople({ mentorRelation: v })} placeholder="e.g. Inspiring teacher" />
              </div>
            </div>
            <div className="border-t border-surface-800 pt-3 space-y-3">
              <p className="text-xs font-medium text-surface-400">Society</p>
              <div>
                <FieldLabel hint="Who the people around you were">Elements</FieldLabel>
                <TagList items={phase.environment.society.elements} onChange={(v) => updateSociety({ elements: v })} placeholder="e.g. Working class families" />
              </div>
              <div>
                <FieldLabel hint="Values held by people around you">Values</FieldLabel>
                <TagList items={phase.environment.society.societalValues} onChange={(v) => updateSociety({ societalValues: v })} placeholder="e.g. Education above all" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={goNext}>Next: Moments &rarr;</Button>
            </div>
          </div>
        </Section>

        {/* ── Moments ──────────────────────────────────────────── */}
        <Section id="moments" title="Notable Moments" icon="&#10038;" filledCount={moments.filled} totalCount={moments.total} isOpen={openSection === "moments"} onToggle={() => toggle("moments")}>
          <div className="space-y-3">
            <p className="text-xs text-surface-500">Memorable events from this phase — positive or negative. What happened, and what did you take from it?</p>
            {phase.moments.map((m, i) => (
              <div key={i} className="bg-surface-900 border border-surface-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-surface-500">Moment {i + 1}</span>
                  {phase.moments.length > 1 && (
                    <button onClick={() => update({ moments: phase.moments.filter((_, j) => j !== i) })} className="text-surface-600 hover:text-red-400 transition-colors cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  )}
                </div>
                <MicTextArea value={m.situation} onChange={(v) => updateMoment(i, { situation: v })} placeholder="What happened?" rows={2} />
                <MicTextArea value={m.conclusion} onChange={(v) => updateMoment(i, { conclusion: v })} placeholder="What conclusion did it reach?" rows={2} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => update({ moments: [...phase.moments, { situation: "", conclusion: "" }] })}
              className="w-full border border-dashed border-surface-700 rounded-xl py-3 text-xs text-surface-500 hover:text-accent-amber hover:border-accent-amber/30 transition-colors cursor-pointer"
            >
              + Add a moment
            </button>
          </div>
        </Section>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={!canSave}>
          Save Phase
        </Button>
      </div>
    </motion.div>
  );
}
