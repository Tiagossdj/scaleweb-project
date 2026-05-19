import type { LCIMatrix, UEVTable } from "@/types/emergy";

export function uevTableToArray(lci: LCIMatrix, uev: UEVTable): number[] {
  return lci.flowNames.map((flow) => uev[flow] ?? 0);
}

export function defaultUEVTable(flowNames: string[]): UEVTable {
  const defaults: Record<string, number> = {
    Eletricidade: 1.8e5,
    Combustível: 5.1e4,
    Combustivel: 5.1e4,
    Água: 4.1e4,
    Agua: 4.1e4,
    Materia_Prima: 2.2e5,
    Mao_de_Obra: 1.5e5,
    Gas_Natural: 6.8e4,
    Carvao: 1.1e5,
    Minerio: 3.5e4,
    Aco: 8.5e4,
    Quimicos: 9.2e4,
    Transporte: 4.5e4,
  };
  return Object.fromEntries(
    flowNames.map((name) => [name, defaults[name] ?? 1e5])
  );
}

export function buildExchangeMatrixFromFlows(
  processCount: number,
  flowMatrix: number[][]
): number[][] {
  return Array.from({ length: processCount }, (_, i) =>
    Array.from({ length: processCount }, (_, j) => flowMatrix[i]?.[j] ?? 0)
  );
}
