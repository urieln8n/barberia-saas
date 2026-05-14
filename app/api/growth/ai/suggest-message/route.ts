import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({
    ok: true,
    message: "Endpoint preparado para futura integración oficial",
  });
}
