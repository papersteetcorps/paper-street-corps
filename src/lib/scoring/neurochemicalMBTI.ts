// lib/scoring/neurochemicalMBTI.ts

/* ================================
   CONFIG
================================ */

export const CHEMICALS = [
    "dopamine",
    "serotonin",
    "norepinephrine",
    "acetylcholine",
    "oxytocin",
  ] as const;
  
  export type Chemical = typeof CHEMICALS[number];
  
  export const TYPE_CENTROIDS: Record<string, number[]> = {
    INTJ: [4.2, 3.1, 3.8, 4.5, 2.2],
    INTP: [4.4, 2.9, 3.2, 4.7, 2.0],
    ENTJ: [4.8, 3.0, 4.6, 3.8, 2.1],
    ENTP: [4.9, 2.7, 3.9, 3.6, 2.3],
    INFJ: [4.0, 3.6, 3.2, 4.4, 3.4],
    INFP: [3.8, 3.4, 2.9, 4.1, 3.8],
    ENFJ: [4.3, 3.8, 3.7, 3.9, 4.2],
    ENFP: [4.6, 3.3, 3.4, 3.6, 4.0],
    ISTJ: [3.1, 4.4, 3.6, 3.2, 1.9],
    ISFJ: [3.0, 4.6, 3.4, 3.1, 3.2],
    ESTJ: [3.4, 4.1, 4.5, 3.0, 2.0],
    ESFJ: [3.3, 4.3, 3.8, 3.0, 4.1],
    ISTP: [3.9, 2.8, 4.2, 3.7, 1.8],
    ISFP: [3.6, 3.0, 3.1, 3.5, 3.9],
    ESTP: [4.5, 2.6, 4.7, 3.1, 2.2],
    ESFP: [4.4, 2.9, 3.8, 3.2, 4.3],
  };
  
  /* ================================
     MATH UTILITIES
  ================================ */
  
  function mean(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  
  function std(arr: number[], m: number) {
    const variance =
      arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1);
    return Math.sqrt(variance);
  }
  
  function transpose(m: number[][]) {
    return m[0].map((_, i) => m.map((r) => r[i]));
  }
  
  function multiply(a: number[][], b: number[][]) {
    return a.map((row) =>
      b[0].map((_, j) =>
        row.reduce((sum, v, i) => sum + v * b[i][j], 0)
      )
    );
  }
  
  function invert(matrix: number[][]): number[][] {
    const n = matrix.length;
    const I = matrix.map((_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    const M = matrix.map((r) => r.slice());
  
    for (let i = 0; i < n; i++) {
      let diag = M[i][i];
      for (let j = 0; j < n; j++) {
        M[i][j] /= diag;
        I[i][j] /= diag;
      }
      for (let k = 0; k < n; k++) {
        if (k === i) continue;
        const factor = M[k][i];
        for (let j = 0; j < n; j++) {
          M[k][j] -= factor * M[i][j];
          I[k][j] -= factor * I[i][j];
        }
      }
    }
    return I;
  }
  
  function softmax(arr: number[]) {
    const exps = arr.map((x) => Math.exp(x));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((x) => x / sum);
  }
  
  /* ================================
     CLASSIFIER
  ================================ */
  
  export class NeurochemicalMBTI {
    private types: string[];
    private zCentroids: number[][];
    private mean: number[];
    private std: number[];
    private invCov: number[][];
  
    constructor(centroids: Record<string, number[]>) {
      this.types = Object.keys(centroids);
      const matrix = Object.values(centroids);
  
      const cols = transpose(matrix);
      this.mean = cols.map(mean);
      this.std = cols.map((c, i) => std(c, this.mean[i]));
  
      this.zCentroids = matrix.map((row) =>
        row.map((v, i) => (v - this.mean[i]) / this.std[i])
      );
  
      const cov = multiply(
        transpose(this.zCentroids),
        this.zCentroids
      );
      this.invCov = invert(cov);
    }
  
    classify(scores: Record<Chemical, number>) {
      const x = CHEMICALS.map((c) => scores[c]);
      const zX = x.map((v, i) => (v - this.mean[i]) / this.std[i]);
  
      const distances = this.zCentroids.map((mu) => {
        const diff = zX.map((v, i) => v - mu[i]);
        const left = multiply([diff], this.invCov)[0];
        const d = Math.sqrt(
          left.reduce((s, v, i) => s + v * diff[i], 0)
        );
        return d;
      });
  
      const probs = softmax(distances.map((d) => -d));
  
      return this.types
        .map((t, i) => ({
          type: t,
          distance: distances[i],
          confidence: probs[i],
        }))
        .sort((a, b) => a.distance - b.distance);
    }
  }
  