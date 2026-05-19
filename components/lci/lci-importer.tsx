"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { parseLCICsv } from "@/lib/parsers/csvParser";
import { parseLCIExcel, getParserForFile } from "@/lib/parsers/excelParser";
import { LCI_SAMPLES } from "@/lib/lci-samples";
import type { LCIMatrix } from "@/types/emergy";

interface LCIImporterProps {
  onImport: (lci: LCIMatrix, sessionName?: string) => void;
}

export function LCIImporter({ onImport }: LCIImporterProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading("file");
    try {
      const type = getParserForFile(file);
      if (!type) throw new Error("Formato não suportado. Use CSV ou Excel.");

      let lci: LCIMatrix;
      if (type === "csv") {
        const text = await file.text();
        lci = parseLCICsv(text);
      } else {
        const buffer = await file.arrayBuffer();
        lci = parseLCIExcel(buffer);
      }
      onImport(lci);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao importar arquivo");
    } finally {
      setLoading(null);
    }
  }

  async function loadSample(sampleId: string) {
    const sample = LCI_SAMPLES.find((s) => s.id === sampleId);
    if (!sample) return;

    setError(null);
    setLoading(sampleId);
    try {
      const res = await fetch(sample.file);
      if (!res.ok) throw new Error("Arquivo não encontrado");
      const text = await res.text();
      onImport(parseLCICsv(text), sample.sessionName);
    } catch {
      setError(`Não foi possível carregar: ${sample.label}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <FileUpload onFile={handleFile} />

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Exemplos para demonstração
        </p>
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
          {LCI_SAMPLES.map((sample) => (
            <div
              key={sample.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4"
            >
              <div>
                <p className="text-sm font-medium">{sample.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sample.description}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading !== null}
                  onClick={() => loadSample(sample.id)}
                >
                  {loading === sample.id ? "Carregando…" : "Carregar"}
                </Button>
                <a href={sample.file} download={sample.downloadName}>
                  <Button type="button" variant="ghost" size="sm">
                    <Download className="h-3.5 w-3.5" />
                    Baixar CSV
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && loading !== "file" && (
        <p className="text-sm text-muted-foreground">Processando exemplo…</p>
      )}
      {loading === "file" && (
        <p className="text-sm text-muted-foreground">Processando arquivo…</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
