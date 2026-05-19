/** Matriz LCI: linhas = fluxos elementares, colunas = processos */
export interface LCIMatrix {
  processNames: string[];
  flowNames: string[];
  A: number[][];
  g: number[];
}

/** Valores específicos de emergia (UEV — Unit Emergy Values) */
export interface UEVTable {
  [flowName: string]: number;
}

/** Resultado do cálculo emergético por processo */
export interface EmergyResult {
  processName: string;
  totalEmergy: number;
  emergySplit: {
    [flowName: string]: number;
  };
}

/** Índices emergéticos do sistema */
export interface EmergyIndices {
  EYR: number;
  ELR: number;
  ESI: number;
  transformity: number;
}

/** Estado completo de uma sessão de cálculo */
export interface CalculationSession {
  id: string;
  name: string;
  lci: LCIMatrix;
  uev: UEVTable;
  results: EmergyResult[];
  indices: EmergyIndices;
  createdAt: string;
}
