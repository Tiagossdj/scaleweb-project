/** Cores pastel dos gráficos — variáveis CSS em formato HSL (sem wrapper) */
export const CHART_FILLS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
] as const;

export function getChartColor(index: number): string {
  return CHART_FILLS[index % CHART_FILLS.length];
}
