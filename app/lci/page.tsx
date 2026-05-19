"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LCIImporter } from "@/components/lci/lci-importer";
import { MatrixEditor } from "@/components/lci/matrix-editor";
import { MatrixPreview } from "@/components/lci/matrix-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/context/session-context";
import { runCalculation } from "@/lib/emergy/calculator";
import { defaultUEVTable } from "@/lib/emergy/transformers";
import type { LCIMatrix, UEVTable } from "@/types/emergy";

export default function LCIPage() {
  const router = useRouter();
  const { draftLci, draftUev, setDraftLci, setDraftUev, saveSession } =
    useSession();
  const [lci, setLci] = useState<LCIMatrix | null>(draftLci ?? null);

  const [uev, setUev] = useState<UEVTable>(draftUev ?? {});
  const [sessionName, setSessionName] = useState("Análise SCALE-Web");
  const [error, setError] = useState<string | null>(null);

  function handleImport(imported: LCIMatrix, name?: string) {
    setLci(imported);
    setDraftLci(imported);
    setUev(defaultUEVTable(imported.flowNames));
    if (name) setSessionName(name);
  }

  function handleLciChange(next: LCIMatrix) {
    setLci(next);
    setDraftLci(next);
  }

  function updateUev(flow: string, value: number) {
    const next = { ...uev, [flow]: value };
    setUev(next);
    setDraftUev(next);
  }

  function handleCalculate() {
    if (!lci) {
      setError("Importe ou carregue dados LCI primeiro.");
      return;
    }
    const missing = lci.flowNames.filter((f) => !uev[f] || uev[f] <= 0);
    if (missing.length > 0) {
      setError(`Configure UEVs válidos para: ${missing.join(", ")}`);
      return;
    }
    setError(null);
    const session = runCalculation(lci, uev, sessionName);
    saveSession(session);
    router.push("/dashboard");
  }

  return (
    <AppShell title="Gestão LCI">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Importar dados LCI</CardTitle>
          </CardHeader>
          <CardContent>
            <LCIImporter onImport={handleImport} />
          </CardContent>
        </Card>

        {lci && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Nome da sessão</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Nome da análise"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Editor de matriz</CardTitle>
              </CardHeader>
              <CardContent>
                <MatrixEditor lci={lci} onChange={handleLciChange} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valores UEV (seJ/unidade)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {lci.flowNames.map((flow) => (
                    <div key={flow} className="flex items-center gap-2">
                      <label className="min-w-28 text-sm">{flow}</label>
                      <Input
                        type="number"
                        className="font-mono"
                        value={uev[flow] ?? ""}
                        onChange={(e) =>
                          updateUev(flow, parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <MatrixPreview lci={lci} />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCalculate}>Calcular Emergia</Button>
              <Button variant="outline" onClick={() => router.push("/results")}>
                Ver resultados
              </Button>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </AppShell>
  );
}
