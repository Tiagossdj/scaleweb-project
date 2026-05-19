"use client";

import type { LCIMatrix } from "@/types/emergy";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MatrixEditorProps {
  lci: LCIMatrix;
  onChange: (lci: LCIMatrix) => void;
}

export function MatrixEditor({ lci, onChange }: MatrixEditorProps) {
  function updateA(row: number, col: number, value: number) {
    const A = lci.A.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value : c))
    );
    onChange({ ...lci, A });
  }

  function updateG(index: number, value: number) {
    const g = [...lci.g];
    g[index] = value;
    onChange({ ...lci, g });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium">Matriz de troca A</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fluxo / Processo</TableHead>
              {lci.processNames.map((name) => (
                <TableHead key={name}>{name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lci.flowNames.map((flow, row) => (
              <TableRow key={flow}>
                <TableCell className="font-medium">{flow}</TableCell>
                {lci.processNames.map((proc, col) => (
                  <TableCell key={`${flow}-${proc}`}>
                    <Input
                      type="number"
                      step="0.01"
                      className="font-mono"
                      value={lci.A[row]?.[col] ?? 0}
                      onChange={(e) =>
                        updateA(row, col, parseFloat(e.target.value) || 0)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Vetor de demanda final g</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lci.processNames.map((name, i) => (
            <div key={name} className="flex items-center gap-2">
              <label className="min-w-24 text-sm text-muted-foreground">{name}</label>
              <Input
                type="number"
                step="0.01"
                className="font-mono"
                value={lci.g[i] ?? 0}
                onChange={(e) => updateG(i, parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
