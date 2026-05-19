import * as XLSX from "xlsx";
import type { LCIMatrix } from "@/types/emergy";
import { parseLCICsv } from "./csvParser";

export function parseLCIExcel(buffer: ArrayBuffer): LCIMatrix {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Planilha vazia");

  const sheet = workbook.Sheets[sheetName];
  const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ";" });
  return parseLCICsv(csv);
}

export function getParserForFile(file: File): "csv" | "excel" | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) return "csv";
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "excel";
  return null;
}
