"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EmergyResult } from "@/types/emergy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartColor } from "@/lib/chart-colors";

const axisTick = { fill: "hsl(var(--muted-foreground))", fontSize: 12 };
const gridStroke = "hsl(var(--border))";

export function EmergyBarChart({ results }: { results: EmergyResult[] }) {
  const data = results.map((r) => ({
    name: r.processName,
    emergia: r.totalEmergy,
  }));

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergia por processo</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridStroke}
              strokeOpacity={0.6}
            />
            <XAxis dataKey="name" tick={axisTick} axisLine={{ stroke: gridStroke }} />
            <YAxis
              tick={axisTick}
              axisLine={{ stroke: gridStroke }}
              tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value ?? 0).toExponential(2)} seJ`,
                "Emergia",
              ]}
              contentStyle={{
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar dataKey="emergia" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`bar-${index}`} fill={getChartColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
