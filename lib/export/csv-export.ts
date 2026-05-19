import type { CalculationSession } from "@/types/emergy";

export function exportSessionToCsv(session: CalculationSession): void {
  const lines: string[] = [
    "processo;emergia_total_seJ",
    ...session.results.map(
      (r) => `${r.processName};${r.totalEmergy}`
    ),
    "",
    "indice;valor",
    `EYR;${session.indices.EYR}`,
    `ELR;${session.indices.ELR}`,
    `ESI;${session.indices.ESI}`,
    `transformidade;${session.indices.transformity}`,
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `scale-web-${session.id.slice(0, 8)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
