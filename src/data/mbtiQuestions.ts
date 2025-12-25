export type Axis = "dopamine" | "serotonin" | "testosterone" | "estrogen";

export interface MBTIQuestion {
  id: string;
  axis: Axis;
  text: string;
}

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // Dopamine
  { id: "dop_1", axis: "dopamine", text: "I actively seek novelty and new experiences." },
  { id: "dop_2", axis: "dopamine", text: "I am excited and energetic most of the time." },
  { id: "dop_3", axis: "dopamine", text: "I am curious and looking to learn or know new things." },
  { id: "dop_4", axis: "dopamine", text: "I am impulsive with my actions and decisions." },

  // Serotonin
  { id: "ser_1", axis: "serotonin", text: "I prefer structure and predictable routines." },
  { id: "ser_2", axis: "serotonin", text: "I respect rules, traditions, and authority." },
  { id: "ser_3", axis: "serotonin", text: "My mood is stable, inert, and non-reactive." },
  { id: "ser_4", axis: "serotonin", text: "I am cautious with my decisions and actions." },

  // Testosterone
  { id: "tes_1", axis: "testosterone", text: "I am comfortable being assertive in discussions." },
  { id: "tes_2", axis: "testosterone", text: "I enjoy competition and challenge." },
  { id: "tes_3", axis: "testosterone", text: "I am a logical and pragmatic thinker." },
  { id: "tes_4", axis: "testosterone", text: "I am direct with my opinions." },

  // Estrogen
  { id: "est_1", axis: "estrogen", text: "I am sensitive to the emotional states of others." },
  { id: "est_2", axis: "estrogen", text: "I value emotional connection and harmony." },
  { id: "est_3", axis: "estrogen", text: "I understand the complexity behind big picture." },
  { id: "est_4", axis: "estrogen", text: "I am empathetic to the happenings of the world." },
];
