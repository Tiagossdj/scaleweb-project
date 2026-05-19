"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CalculationSession } from "@/types/emergy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartColor } from "@/lib/chart-colors";

const axisTick = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };
const gridStroke = "hsl(var(--border))";

const tooltipStyle = {
  background: "hsl(var(--card))",
  color: "hsl(var(--card-foreground))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

type ChartRow = { name: string; [flow: string]: string | number };

function buildChartData(session: CalculationSession): ChartRow[] {
  return session.results.map((r) => {
    const row: ChartRow = { name: r.processName };
    session.lci.flowNames.forEach((flow) => {
      row[flow] = r.emergySplit[flow] ?? 0;
    });
    return row;
  });
}

export function EmergyStackedChart({ session }: { session: CalculationSession }) {
  const flowNames = session.lci.flowNames;
  const data = buildChartData(session);

  if (data.length === 0 || flowNames.length === 0) {
    return null;
  }

  const rotateLabels = data.length > 5;
  const bottomMargin = rotateLabels ? 72 : 24;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Composição da emergia por processo</CardTitle>
      </CardHeader>
      <CardContent className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: bottomMargin }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridStroke}
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="name"
              tick={axisTick}
              axisLine={{ stroke: gridStroke }}
              interval={0}
              angle={rotateLabels ? -35 : 0}
              textAnchor={rotateLabels ? "end" : "middle"}
              height={rotateLabels ? 70 : 30}
            />
            <YAxis
              tick={axisTick}
              axisLine={{ stroke: gridStroke }}
              tickFormatter={(v) => `${(Number(v) / 1e6).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value, name) => [
                `${Number(value ?? 0).toExponential(2)} seJ`,
                String(name),
              ]}
              contentStyle={tooltipStyle}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
            />
            {flowNames.map((flow, index) => (
              <Bar
                key={flow}
                dataKey={flow}
                name={flow}
                stackId="emergy"
                fill={getChartColor(index)}
                radius={index === flowNames.length - 1 ? [4, 4, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
