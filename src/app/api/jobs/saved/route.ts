import { NextRequest, NextResponse } from "next/server";
import { getJobsByIds } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ids: number[] = Array.isArray(body?.ids)
    ? body.ids.map(Number).filter((n: number) => !isNaN(n) && n > 0).slice(0, 100)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ jobs: [] });
  }

  const jobs = await getJobsByIds(ids);
  return NextResponse.json({ jobs });
}
