import {
  solveLeontief,
  calculateEmergyIndices,
  applyJointProductionRule,
  applySplitPathRule,
  resolveFeedbackLoops,
  calculateEmergyByProcess,
} from "@/lib/emergy/algebra";

describe("solveLeontief", () => {
  it("deve resolver sistema 2x2 simples", () => {
    const A = [
      [0, 0.5],
      [0.2, 0],
    ];
    const g = [100, 50];
    const result = solveLeontief(A, g);
    // x = (I-A)^-1·g → [138.89, 77.78] para A e g do spec
    expect(result[0]).toBeCloseTo(138.89, 1);
    expect(result[1]).toBeCloseTo(77.78, 1);
  });

  it("deve lançar erro para matriz singular", () => {
    const A = [
      [1, 0],
      [0, 1],
    ];
    expect(() => solveLeontief(A, [1, 1])).toThrow();
  });
});

describe("calculateEmergyIndices", () => {
  it("EYR deve ser > 1 para sistema viável", () => {
    const indices = calculateEmergyIndices(500, 300, 200, 1200);
    expect(indices.EYR).toBeGreaterThan(1);
  });

  it("ESI = EYR / ELR", () => {
    const indices = calculateEmergyIndices(500, 300, 200, 1200);
    expect(indices.ESI).toBeCloseTo(indices.EYR / indices.ELR, 5);
  });
});

describe("applyJointProductionRule", () => {
  it("atribui emergia total a cada co-produto", () => {
    const emergyValues = [100, 100, 50];
    const isCoProduct = [true, true, false];
    const result = applyJointProductionRule(emergyValues, isCoProduct);
    expect(result[0]).toBe(100);
    expect(result[1]).toBe(100);
    expect(result[2]).toBe(50);
  });
});

describe("applySplitPathRule", () => {
  it("contabiliza emergia uma única vez em split path", () => {
    const paths = [
      [1, 0],
      [0, 1],
    ];
    const emergyPerPath = [80, 80];
    const result = applySplitPathRule(paths, emergyPerPath);
    expect(result).toBe(80);
  });
});

describe("resolveFeedbackLoops", () => {
  it("converge para solução estável", () => {
    const A = [
      [0, 0.3],
      [0.2, 0],
    ];
    const g = [10, 5];
    const result = resolveFeedbackLoops(A, g);
    const direct = solveLeontief(A, g);
    expect(result[0]).toBeCloseTo(direct[0], 4);
    expect(result[1]).toBeCloseTo(direct[1], 4);
  });
});

describe("calculateEmergyByProcess", () => {
  it("calcula emergia por processo", () => {
    const x = [100, 50];
    const A = [
      [0, 0.5],
      [0.2, 0],
    ];
    const uev = [1.8e5, 2.5e5];
    const result = calculateEmergyByProcess(x, A, uev);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeGreaterThan(0);
    expect(result[1]).toBeGreaterThan(0);
  });
});
