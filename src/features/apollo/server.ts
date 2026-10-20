import { print, type DocumentNode } from "graphql";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ANNICT_GRAPHQL_URL = "https://api.annict.com/graphql";

type GraphQLErrorShape = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorShape[];
};

async function getTokenFromCookies() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  if (!cookieHeader) {
    return null;
  }

  return getToken({
    // next-auth は Cookie ヘッダから JWT を復号する
    req: {
      headers: {
        cookie: cookieHeader,
      },
    } as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });
}

/** Server Components / Route Handler 共通。JWT からのみトークンを読む */
export async function getAccessToken(req?: NextRequest): Promise<string | null> {
  const token = req
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    : await getTokenFromCookies();

  return typeof token?.accessToken === "string" ? token.accessToken : null;
}

export async function fetchAnnictGraphQL<T>(
  accessToken: string,
  body: {
    query: string;
    variables?: Record<string, unknown>;
    operationName?: string;
  },
): Promise<{ ok: true; json: GraphQLResponse<T> } | { ok: false; status: number; message: string }> {
  const response = await fetch(ANNICT_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: `Annict GraphQL HTTP ${response.status}`,
    };
  }

  const json = (await response.json()) as GraphQLResponse<T>;
  return { ok: true, json };
}

export async function serverFetchGraphQL<T>(
  document: DocumentNode,
  variables?: Record<string, unknown>,
): Promise<T> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const result = await fetchAnnictGraphQL<T>(accessToken, {
    query: print(document),
    variables,
  });

  if (!result.ok) {
    throw new Error(result.message);
  }

  if (result.json.errors?.length) {
    throw new Error(result.json.errors.map((error) => error.message).join(", "));
  }
  if (!result.json.data) {
    throw new Error("Annict GraphQL returned empty data");
  }

  return result.json.data;
}
