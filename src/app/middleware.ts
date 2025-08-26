import { NextResponse } from "next/server";

// Delegate to the root-level middleware (project /middleware.ts)
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
