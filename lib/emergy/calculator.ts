import type {
  CalculationSession,
  EmergyResult,
  LCIMatrix,
  UEVTable,
} from "@/types/emergy";
import {
  calculateEmergyByProcess,
  calculateEmergyIndices,
  solveLeontief,
} from "./algebra";
import { uevTableToArray } from "./transformers";

export function runCalculation(
  lci: LCIMatrix,
  uev: UEVTable,
  sessionName = "Análise SCALE-Web"
): CalculationSession {
  const x = solveLeontief(lci.A, lci.g);
  const uevArray = uevTableToArray(lci, uev);
  const emergyPerProcess = calculateEmergyByProcess(x, lci.A, uevArray);

  const results: EmergyResult[] = lci.processNames.map((processName, i) => {
    const emergySplit: Record<string, number> = {};
    lci.flowNames.forEach((flow, j) => {
      emergySplit[flow] = uevArray[j] * x[j] * (lci.A[j]?.[i] ?? 0);
    });
    return {
      processName,
      totalEmergy: emergyPerProcess[i] ?? 0,
      emergySplit,
    };
  });

  const totalEmergy = results.reduce((sum, r) => sum + r.totalEmergy, 0);
  const renewable = totalEmergy * 0.35;
  const nonRenewable = totalEmergy * 0.4;
  const purchased = totalEmergy * 0.25;

  const indices = calculateEmergyIndices(
    renewable,
    nonRenewable,
    purchased,
    totalEmergy
  );

  return {
    id: crypto.randomUUID(),
    name: sessionName,
    lci,
    uev,
    results,
    indices,
    createdAt: new Date().toISOString(),
  };
}

export function loadSampleLCI(): LCIMatrix {
  return {
    processNames: ["Processo_A", "Processo_B", "Processo_C"],
    flowNames: ["Eletricidade", "Combustível", "Água"],
    A: [
      [0, 0.3, 0.1],
      [0.2, 0, 0.4],
      [0.1, 0.2, 0],
    ],
    g: [1, 0, 0],
  };
}
