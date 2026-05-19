import { NextResponse } from "next/server";
import { runCalculation } from "@/lib/emergy/calculator";
import type { LCIMatrix, UEVTable } from "@/types/emergy";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      lci: LCIMatrix;
      uev: UEVTable;
      name?: string;
    };
    if (!body.lci || !body.uev) {
      return NextResponse.json(
        { error: "lci e uev são obrigatórios" },
        { status: 400 }
      );
    }
    const session = runCalculation(body.lci, body.uev, body.name);
    return NextResponse.json(session);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro no cálculo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
