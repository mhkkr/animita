import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const episodeId = request.nextUrl.searchParams.get("episodeId");
  if (!episodeId || !/^\d+$/.test(episodeId)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `${url.pathname}/episode/${episodeId}`;
  url.searchParams.delete("episodeId");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/anime/:annictId",
};
