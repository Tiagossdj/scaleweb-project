"use client";

import { Leaf, Scale, TrendingUp, Zap } from "lucide-react";
import type { EmergyIndices } from "@/types/emergy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EmergySummaryProps {
  indices: EmergyIndices | null;
}

const cards = [
  {
    key: "EYR" as const,
    label: "EYR",
    desc: "Emergy Yield Ratio",
    icon: TrendingUp,
    accent: "border-l-chart-1",
    iconClass: "text-chart-1",
    good: (v: number) => v > 1,
  },
  {
    key: "ELR" as const,
    label: "ELR",
    desc: "Environmental Loading Ratio",
    icon: Scale,
    accent: "border-l-chart-2",
    iconClass: "text-chart-2",
    good: (v: number) => v < 1,
  },
  {
    key: "ESI" as const,
    label: "ESI",
    desc: "Emergy Sustainability Index",
    icon: Leaf,
    accent: "border-l-chart-3",
    iconClass: "text-chart-3",
    good: (v: number) => v > 1,
  },
  {
    key: "transformity" as const,
    label: "Transformidade",
    desc: "seJ/J",
    icon: Zap,
    accent: "border-l-chart-4",
    iconClass: "text-chart-4",
    good: () => true,
  },
];

export function EmergySummary({ indices }: EmergySummaryProps) {
  if (!indices) {
    return (
      <p className="text-muted-foreground">
        Nenhum cálculo realizado. Importe dados LCI e calcule a emergia.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, desc, icon: Icon, accent, iconClass, good }) => {
        const value = indices[key];
        const sustainable = good(value);
        return (
          <Card key={key} className={cn("border-l-4", accent)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={cn("h-4 w-4", iconClass)} />
            </CardHeader>
            <CardContent>
              <p className="font-mono text-2xl font-bold">
                {key === "transformity" ? value.toExponential(2) : value.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              {key !== "transformity" && (
                <Badge
                  variant={sustainable ? "success" : "danger"}
                  className={cn("mt-3")}
                >
                  {sustainable ? "Sustentável" : "Crítico"}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function SessionSummary({
  name,
  createdAt,
  processCount,
}: {
  name: string;
  createdAt: string;
  processCount: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessão atual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Nome:</span> {name}
        </p>
        <p>
          <span className="text-muted-foreground">Data:</span>{" "}
          {new Date(createdAt).toLocaleString("pt-BR")}
        </p>
        <p>
          <span className="text-muted-foreground">Processos:</span> {processCount}
        </p>
      </CardContent>
    </Card>
  );
}
