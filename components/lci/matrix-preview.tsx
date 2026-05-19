import type { LCIMatrix } from "@/types/emergy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MatrixPreview({ lci }: { lci: LCIMatrix }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fluxo</TableHead>
          {lci.processNames.map((p) => (
            <TableHead key={p}>{p}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {lci.flowNames.map((flow, i) => (
          <TableRow key={flow}>
            <TableCell className="font-medium">{flow}</TableCell>
            {lci.processNames.map((_, j) => (
              <TableCell key={j} className="font-mono">
                {lci.A[i]?.[j] ?? 0}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
