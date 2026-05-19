"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { CalculationSession } from "@/types/emergy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartColor } from "@/lib/chart-colors";

interface FlowNode extends d3.SimulationNodeDatum {
  id: string;
}

interface FlowLinkInput {
  source: string;
  target: string;
  value: number;
}

function nodeCoord(ref: string | FlowNode, axis: "x" | "y"): number {
  return typeof ref === "object" ? (ref[axis] ?? 0) : 0;
}

export function EmergyFlowChart({ session }: { session: CalculationSession }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !session) return;

    const links: FlowLinkInput[] = [];
    session.results.forEach((result) => {
      Object.entries(result.emergySplit).forEach(([flow, value]) => {
        if (value > 0) {
          links.push({ source: flow, target: result.processName, value });
        }
      });
    });

    const nodeIds = Array.from(
      new Set(links.flatMap((l) => [l.source, l.target]))
    );
    const nodes: FlowNode[] = nodeIds.map((id) => ({ id }));
    const nodeColorMap = new Map(
      nodeIds.map((id, i) => [id, getChartColor(i)])
    );

    const width = 640;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink<FlowNode, FlowLinkInput>(links).id((d) => d.id).distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => nodeColorMap.get(String(d.source)) ?? getChartColor(0))
      .attr("stroke-opacity", 0.75)
      .attr("stroke-width", (d) => Math.max(1, Math.log10(d.value + 1)));

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g");

    node
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => nodeColorMap.get(d.id) ?? getChartColor(0))
      .attr("stroke", "hsl(var(--card))")
      .attr("stroke-width", 2);

    node
      .append("text")
      .text((d) => d.id)
      .attr("x", 14)
      .attr("y", 4)
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", 11);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => nodeCoord(d.source, "x"))
        .attr("y1", (d) => nodeCoord(d.source, "y"))
        .attr("x2", (d) => nodeCoord(d.target, "x"))
        .attr("y2", (d) => nodeCoord(d.target, "y"));

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagrama de fluxos emergéticos</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} className="w-full min-h-[400px]" />
      </CardContent>
    </Card>
  );
}
