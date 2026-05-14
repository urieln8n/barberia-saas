import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    message: "Endpoint preparado para futura integración oficial",
  });
}

export function POST() {
  return NextResponse.json({
    ok: true,
    message: "Endpoint preparado para futura integración oficial",
  });
}
