import { create, all, type Matrix } from "mathjs";
import type { EmergyIndices } from "@/types/emergy";

const math = create(all);

/**
 * Regra 1 — Co-produtos: emergia total atribuída a CADA co-produto
 */
export function applyJointProductionRule(
  emergyValues: number[],
  isCoProduct: boolean[]
): number[] {
  return emergyValues.map((value, i) => (isCoProduct[i] ? value : value));
}

/**
 * Regra 2 — Split path: emergia contabilizada uma única vez
 */
export function applySplitPathRule(
  _paths: number[][],
  emergyPerPath: number[]
): number {
  if (emergyPerPath.length === 0) return 0;
  return Math.max(...emergyPerPath);
}

/**
 * Regra 3 — Feedback loops: iteração até convergência
 */
export function resolveFeedbackLoops(
  A: number[][],
  g: number[],
  maxIterations = 1000,
  tolerance = 1e-9
): number[] {
  const n = g.length;
  let x = [...g];

  for (let iter = 0; iter < maxIterations; iter++) {
    const next = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = g[i];
      for (let j = 0; j < n; j++) {
        sum += A[i][j] * x[j];
      }
      next[i] = sum;
    }

    const delta = Math.max(...next.map((v, i) => Math.abs(v - x[i])));
    x = next;
    if (delta < tolerance) break;
  }

  return x;
}

/**
 * Resolução matricial: x = (I - A)^-1 · g
 */
export function solveLeontief(A: number[][], g: number[]): number[] {
  const n = A.length;
  if (n === 0 || g.length !== n) {
    throw new Error("Dimensões incompatíveis entre A e g");
  }

  try {
    const I = math.identity(n) as Matrix;
    const Am = math.matrix(A) as Matrix;
    const IminusA = math.subtract(I, Am) as Matrix;
    const IminusA_inv = math.inv(IminusA) as Matrix;
    const result = math.multiply(IminusA_inv, math.matrix(g));
    return math.matrix(result).toArray() as number[];
  } catch {
    throw new Error("Matriz singular: sistema LCI não possui solução única");
  }
}

/**
 * Emergia total por processo: E_i = Σ_j (UEV_j × x_j × a_ji)
 */
export function calculateEmergyByProcess(
  x: number[],
  A: number[][],
  uev: number[]
): number[] {
  const n = x.length;
  const emergy = new Array<number>(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      emergy[i] += uev[j] * x[j] * (A[j]?.[i] ?? 0);
    }
  }

  return emergy;
}

/**
 * Índices emergéticos do sistema
 */
export function calculateEmergyIndices(
  renewableEmergy: number,
  nonRenewableEmergy: number,
  purchasedEmergy: number,
  totalOutput: number
): EmergyIndices {
  const totalInput =
    renewableEmergy + nonRenewableEmergy + purchasedEmergy;
  const EYR = purchasedEmergy > 0 ? totalOutput / purchasedEmergy : 0;
  const ELR =
    renewableEmergy > 0
      ? (nonRenewableEmergy + purchasedEmergy) / renewableEmergy
      : 0;
  const ESI = ELR > 0 ? EYR / ELR : 0;

  return {
    EYR,
    ELR,
    ESI,
    transformity: totalOutput > 0 ? totalInput / totalOutput : 0,
  };
}
