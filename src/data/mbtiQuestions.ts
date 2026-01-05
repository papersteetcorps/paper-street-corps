export type Axis = "dopamine" | "serotonin" | "testosterone" | "estrogen";

export interface MBTIQuestion {
  id: string;
  axis: Axis;
  text: string;
}

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // Dopamine
  { id: "dop_1", axis: "dopamine", text: "DOPAMINE: Drive toward goals, novelty, and reward, shaping initiative and exploration." },

  // Serotonin
  { id: "ser_1", axis: "serotonin", text: "SEROTONIN: Capacity for inhibition, stability, and self-regulation, shaping restraint and consistency." },

  // Testosterone
  { id: "tes_1", axis: "testosterone", text: "TESTOSTERONE: Tendency to assert, compete, or impose will, shaping dominance and confrontation style." },

  // Estrogen
  { id: "est_1", axis: "estrogen", text: "ESTROGEN: Degree of contextual and emotional integration, shaping sensitivity to nuance and relationships." },
];
