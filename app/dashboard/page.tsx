"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { EmergySummary, SessionSummary } from "@/components/emergy/emergy-summary";
import { EmergyBarChart } from "@/components/emergy/emergy-bar-chart";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/session-context";

export default function DashboardPage() {
  const { session } = useSession();

  return (
    <AppShell title="Dashboard">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground">
            Visão geral dos índices emergéticos e resultados da sessão atual.
          </p>
          <Link href="/lci" className="no-print">
            <Button>Nova Análise</Button>
          </Link>
        </div>

        <EmergySummary indices={session?.indices ?? null} />

        <div className="grid gap-6 lg:grid-cols-3">
          {session ? (
            <>
              <div className="lg:col-span-2">
                <EmergyBarChart results={session.results} />
              </div>
              <SessionSummary
                name={session.name}
                createdAt={session.createdAt}
                processCount={session.lci.processNames.length}
              />
            </>
          ) : (
            <p className="text-muted-foreground lg:col-span-3">
              Execute um cálculo em{" "}
              <Link href="/lci" className="text-primary underline">
                Gestão LCI
              </Link>{" "}
              para visualizar os gráficos.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
