import { NextRequest, NextResponse } from "next/server";

import { fetchAnnictGraphQL, getAccessToken } from "~/features/apollo/server";

type GraphQLRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

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

function isAllowedRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // 同一オリジンでも Origin が付くことがほとんどだが、無い場合は Referer で補助確認
    const referer = request.headers.get("referer");
    if (!referer) {
      return false;
    }
    try {
      const refererOrigin = new URL(referer).origin;
      return getAllowedOrigins().includes(refererOrigin);
    } catch {
      return false;
    }
  }

  return getAllowedOrigins().includes(origin.replace(/\/$/, ""));
}

export async function POST(request: NextRequest) {
  if (!isAllowedRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GraphQLRequestBody;
  try {
    body = (await request.json()) as GraphQLRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.query || typeof body.query !== "string") {
    return NextResponse.json({ error: "Missing GraphQL query" }, { status: 400 });
  }

  const result = await fetchAnnictGraphQL(accessToken, {
    query: body.query,
    variables: body.variables,
    operationName: body.operationName,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  // Annict の GraphQL レスポンスをそのまま返す（トークンは含めない）
  return NextResponse.json(result.json);
}
