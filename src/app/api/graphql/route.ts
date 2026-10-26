import { NextRequest, NextResponse } from "next/server";

import { fetchAnnictGraphQL, getAccessToken } from "~/features/apollo/server";
import { isAllowedRequest } from "~/libs/allowedOrigin";

type GraphQLRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

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
