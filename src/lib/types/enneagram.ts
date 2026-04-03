export interface Submap {
  name: string;
  slice: string;
  frequency: string;
}

export interface Moment {
  situation: string;
  conclusion: string;
}

export interface LifePhase {
  id: string;
  phaseName: string;
  map: string;
  submaps: Submap[];
  info: {
    ageRange: string;
    occupation: string;
    illness: string[];
  };
  lifestyle: {
    routine: string[];
    facilities: string[];
    scarcity: string[];
  };
  environment: {
    locality: string;
    people: {
      guardianRelation: string[];
      siblingRelation: string[];
      friendsRelation: string[];
      mentorRelation: string[];
    };
    society: {
      elements: string[];
      societalValues: string[];
    };
  };
  moments: Moment[];
}

export function createEmptyPhase(): LifePhase {
  return {
    id: crypto.randomUUID(),
    phaseName: "",
    map: "",
    submaps: [],
    info: {
      ageRange: "",
      occupation: "",
      illness: [],
    },
    lifestyle: {
      routine: [],
      facilities: [],
      scarcity: [],
    },
    environment: {
      locality: "",
      people: {
        guardianRelation: [],
        siblingRelation: [],
        friendsRelation: [],
        mentorRelation: [],
      },
      society: {
        elements: [],
        societalValues: [],
      },
    },
    moments: [{ situation: "", conclusion: "" }],
  };
}

/** Convert LifePhase to the JSON shape the INEE engine expects */
export function phaseToPayload(phase: LifePhase) {
  const submaps: Record<string, { slice: string; frequency: string }> = {};
  phase.submaps.forEach((s, i) => {
    const key = s.name.trim() || `submap${i + 1}`;
    submaps[key] = { slice: s.slice, frequency: s.frequency };
  });

  const moments: Record<string, string> = {};
  phase.moments.forEach((m, i) => {
    if (m.situation.trim()) {
      moments[m.situation.trim()] = m.conclusion.trim();
    } else if (m.conclusion.trim()) {
      moments[`situation${i + 1}`] = m.conclusion.trim();
    }
  });

  return {
    [phase.phaseName.trim() || "unnamed_phase"]: {
      map: phase.map,
      submaps,
      info: {
        age_range: phase.info.ageRange,
        occupation: phase.info.occupation,
        illness: phase.info.illness.filter(Boolean),
      },
      lifestyle: {
        routine: phase.lifestyle.routine.filter(Boolean),
        facilities: phase.lifestyle.facilities.filter(Boolean),
        scarcity: phase.lifestyle.scarcity.filter(Boolean),
      },
      environment: {
        locality: phase.environment.locality,
        people: {
          guardian_relation: phase.environment.people.guardianRelation.filter(Boolean),
          sibling_relation: phase.environment.people.siblingRelation.filter(Boolean),
          friends_relation: phase.environment.people.friendsRelation.filter(Boolean),
          mentor_relation: phase.environment.people.mentorRelation.filter(Boolean),
        },
        society: {
          elements: phase.environment.society.elements.filter(Boolean),
          societal_values: phase.environment.society.societalValues.filter(Boolean),
        },
      },
      moments,
    },
  };
}
