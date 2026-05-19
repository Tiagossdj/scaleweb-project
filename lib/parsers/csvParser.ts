import Papa from "papaparse";
import type { LCIMatrix } from "@/types/emergy";

function detectDelimiter(text: string): string {
  const firstLine = text.split("\n")[0] ?? "";
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  return semicolons >= commas ? ";" : ",";
}

export function parseLCICsv(text: string): LCIMatrix {
  const delimiter = detectDelimiter(text);
  const parsed = Papa.parse<string[]>(text, {
    delimiter,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? "Erro ao parsear CSV");
  }

  const rows = parsed.data.filter((row) => row.length > 1);
  if (rows.length < 2) {
    throw new Error("CSV deve ter cabeçalho e ao menos uma linha de fluxo");
  }

  const header = rows[0];
  const processNames = header.slice(1).map((name) => name.trim());
  const flowNames: string[] = [];
  const n = processNames.length;

  const A: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  );

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const flowIdx = i - 1;
    if (flowIdx >= n) break;
    flowNames.push(String(row[0] ?? "").trim());
    for (let j = 0; j < n; j++) {
      const raw = row[j + 1] ?? "0";
      A[flowIdx][j] = parseFloat(String(raw).replace(",", ".")) || 0;
    }
  }

  const g = processNames.map((_, i) => (i === 0 ? 1 : 0));

  return { processNames, flowNames, A, g };
}
