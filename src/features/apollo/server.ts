import { print, type DocumentNode } from "graphql";
import { decode, getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const ANNICT_GRAPHQL_URL = "https://api.annict.com/graphql";

type GraphQLErrorShape = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorShape[];
};

const SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
] as const;

/** next-auth は JWT が大きいと session-token.0 / .1 に分割する */
function readSessionTokenFromCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): string | null {
  for (const name of SESSION_COOKIE_NAMES) {
    const direct = cookieStore.get(name)?.value;
    if (direct) {
      return direct;
    }

    const chunks: string[] = [];
    for (let index = 0; ; index += 1) {
      const chunk = cookieStore.get(`${name}.${index}`)?.value;
      if (!chunk) {
        break;
      }
      chunks.push(chunk);
    }
    if (chunks.length > 0) {
      return chunks.join("");
    }
  }

  return null;
}

/** Server Components / Route Handler 共通。JWT からのみトークンを読む */
export async function getAccessToken(req?: NextRequest): Promise<string | null> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return null;
  }

  if (req) {
    const token = await getToken({ req, secret });
    return typeof token?.accessToken === "string" ? token.accessToken : null;
  }

  // RSC では NextRequest が無いため、Cookie を直接読んで decode する
  const cookieStore = await cookies();
  const sessionToken = readSessionTokenFromCookies(cookieStore);
  if (!sessionToken) {
    return null;
  }

  const token = await decode({
    token: sessionToken,
    secret,
  });

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
    const detail = (await response.text()).slice(0, 500);
    console.error(`Annict GraphQL HTTP ${response.status}: ${detail}`);
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
