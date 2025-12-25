export type MBTIType =
  | "ISTJ" | "ISFJ" | "INFJ" | "INTJ"
  | "ISTP" | "ISFP" | "INFP" | "INTP"
  | "ESTP" | "ESFP" | "ENFP" | "ENTP"
  | "ESTJ" | "ESFJ" | "ENFJ" | "ENTJ";

export interface MBTIResult {
  type: MBTIType;
  distance: number;
  ranking: Array<{ type: MBTIType; distance: number }>;
  userScores: {
    dopamine: number;
    serotonin: number;
    testosterone: number;
    estrogen: number;
  };
}

const CENTROIDS: Record<MBTIType, [number, number, number, number]> = {
  ISTJ: [2, 5, 3, 2],
  ISFJ: [2, 5, 2, 3],
  INFJ: [3, 3, 2, 5],
  INTJ: [3, 2, 4, 3],
  ISTP: [4, 2, 4, 2],
  ISFP: [3, 3, 2, 4],
  INFP: [3, 2, 1, 5],
  INTP: [4, 2, 4, 2],
  ESTP: [5, 1, 5, 1],
  ESFP: [5, 2, 3, 3],
  ENFP: [5, 2, 2, 4],
  ENTP: [5, 1, 4, 2],
  ESTJ: [3, 4, 5, 1],
  ESFJ: [2, 5, 2, 4],
  ENFJ: [4, 3, 2, 5],
  ENTJ: [4, 2, 5, 2],
};

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );
}

const avg = (arr: number[]) =>
  arr.reduce((a, b) => a + b, 0) / arr.length;

export function classifyMBTI(
  dopamine: number[],
  serotonin: number[],
  testosterone: number[],
  estrogen: number[]
): MBTIResult {
  const averaged = {
    dopamine: avg(dopamine),
    serotonin: avg(serotonin),
    testosterone: avg(testosterone),
    estrogen: avg(estrogen),
  };

  const userVector = [
    averaged.dopamine,
    averaged.serotonin,
    averaged.testosterone,
    averaged.estrogen,
  ];

  const distances: Array<{ type: MBTIType; distance: number }> = [];

  for (const [type, centroid] of Object.entries(CENTROIDS)) {
    distances.push({
      type: type as MBTIType,
      distance: euclideanDistance(userVector, centroid),
    });
  }

  distances.sort((a, b) => a.distance - b.distance);

  return {
    type: distances[0].type,
    distance: distances[0].distance,
    ranking: distances,
    userScores: averaged,
  };
}


export function getCentroid(
  type: MBTIType
): [number, number, number, number] {
  return CENTROIDS[type];
}
