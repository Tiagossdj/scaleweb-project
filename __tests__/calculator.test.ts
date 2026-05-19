import { loadSampleLCI, runCalculation } from "@/lib/emergy/calculator";

describe("runCalculation", () => {
  it("pipeline completo: LCI → resultados emergéticos", () => {
    const lci = loadSampleLCI();
    const uev = {
      Eletricidade: 1.8e5,
      Combustível: 5.1e4,
      Água: 4.1e4,
    };
    const session = runCalculation(lci, uev);
    expect(session.results).toHaveLength(lci.processNames.length);
    expect(session.indices.EYR).toBeGreaterThan(0);
    expect(session.indices.ESI).toBeCloseTo(
      session.indices.EYR / session.indices.ELR,
      5
    );
  });
});
