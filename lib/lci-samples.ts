export interface LCISampleMeta {
  id: string;
  label: string;
  description: string;
  file: string;
  downloadName: string;
  sessionName: string;
}

export const LCI_SAMPLES: LCISampleMeta[] = [
  {
    id: "simple",
    label: "Exemplo simples",
    description: "3 processos · 3 fluxos — ideal para primeiro teste",
    file: "/sample-lci.csv",
    downloadName: "sample-lci.csv",
    sessionName: "Demo simples (3 processos)",
  },
  {
    id: "medium",
    label: "Exemplo médio",
    description: "5 processos · 5 fluxos — cadeia produtiva básica",
    file: "/sample-lci-medium.csv",
    downloadName: "sample-lci-medium.csv",
    sessionName: "Demo média complexidade (5 processos)",
  },
  {
    id: "high",
    label: "Exemplo avançado",
    description: "8 processos · 8 fluxos — rede industrial densa",
    file: "/sample-lci-high.csv",
    downloadName: "sample-lci-high.csv",
    sessionName: "Demo alta complexidade (8 processos)",
  },
];
