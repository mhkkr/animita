import type { NextRequest } from "next/server";

function getAllowedOrigins(): string[] {
  const origins = [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_NEXTAUTH_URL,
  ];

  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  return origins
    .filter((value): value is string => Boolean(value))
    .map((value) => value.replace(/\/$/, ""));
}

/** 同一オリジンの画面からの API 呼び出しだけを通す */
export function isAllowedRequest(request: NextRequest): boolean {
  const allowed = getAllowedOrigins();
  const origin = request.headers.get("origin");
  if (!origin) {
    const referer = request.headers.get("referer");
    if (!referer) return false;
    try {
      return allowed.includes(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return allowed.includes(origin.replace(/\/$/, ""));
}
