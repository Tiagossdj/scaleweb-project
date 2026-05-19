"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { EmergyFlowChart } from "@/components/emergy/emergy-flow-chart";
import { EmergyStackedChart } from "@/components/emergy/emergy-stacked-chart";
import { EmergySummary } from "@/components/emergy/emergy-summary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/context/session-context";
import { exportSessionToCsv } from "@/lib/export/csv-export";
import { formatEmergy } from "@/lib/utils";
import type { CalculationSession } from "@/types/emergy";

type ResultsTab = "rede" | "composicao" | "dados";

export default function ResultsPage() {
  const { session } = useSession();
  const [tab, setTab] = useState<ResultsTab>("rede");

  if (!session) {
    return (
      <AppShell title="Resultados">
        <p className="text-muted-foreground">
          Nenhum resultado disponível.{" "}
          <Link href="/lci" className="text-primary underline">
            Calcule a emergia
          </Link>{" "}
          primeiro.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Resultados">
      <div className="space-y-6 print:space-y-4">
        <div className="flex flex-wrap gap-3 no-print">
          <Button onClick={() => exportSessionToCsv(session)}>Exportar CSV</Button>
          <Button variant="outline" onClick={() => window.print()}>
            Exportar PDF
          </Button>
        </div>

        <EmergySummary indices={session.indices} />

        <Tabs value={tab} onValueChange={(v) => setTab(v as ResultsTab)} className="no-print">
          <TabsList aria-label="Visualizações de resultados">
            <TabsTrigger value="rede">Rede</TabsTrigger>
            <TabsTrigger value="composicao">Composição</TabsTrigger>
            <TabsTrigger value="dados">Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="rede">
            <EmergyFlowChart session={session} />
          </TabsContent>

          <TabsContent value="composicao">
            <EmergyStackedChart session={session} />
          </TabsContent>

          <TabsContent value="dados" className="space-y-8">
            <ResultsDataTables session={session} />
          </TabsContent>
        </Tabs>

        <div className="hidden print:block">
          <ResultsDataTables session={session} />
        </div>
      </div>
    </AppShell>
  );
}

function ResultsDataTables({ session }: { session: CalculationSession }) {
  return (
    <>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Emergia por processo</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Processo</TableHead>
              <TableHead>Emergia total</TableHead>
              {session.lci.flowNames.map((f) => (
                <TableHead key={f}>{f}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {session.results.map((r) => (
              <TableRow key={r.processName}>
                <TableCell className="font-medium">{r.processName}</TableCell>
                <TableCell className="font-mono">
                  {formatEmergy(r.totalEmergy)}
                </TableCell>
                {session.lci.flowNames.map((f) => (
                  <TableCell key={f} className="font-mono text-xs">
                    {formatEmergy(r.emergySplit[f] ?? 0)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Índices emergéticos</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Índice</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Benchmark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>EYR</TableCell>
              <TableCell className="font-mono">{session.indices.EYR.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={session.indices.EYR > 1 ? "success" : "danger"}>
                  {session.indices.EYR > 1 ? "Viável (>1)" : "Crítico"}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ELR</TableCell>
              <TableCell className="font-mono">{session.indices.ELR.toFixed(2)}</TableCell>
              <TableCell>Quanto menor, menor a carga ambiental</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ESI</TableCell>
              <TableCell className="font-mono">{session.indices.ESI.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={session.indices.ESI > 1 ? "success" : "danger"}>
                  {session.indices.ESI > 1 ? "Sustentável (>1)" : "Crítico"}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transformidade</TableCell>
              <TableCell className="font-mono">
                {session.indices.transformity.toExponential(2)} seJ/J
              </TableCell>
              <TableCell>—</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
