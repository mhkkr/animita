import { print, type DocumentNode } from "graphql";
import { getServerSession } from "next-auth";

import { authOptions } from "~/features/oauth/auth";

const ANNICT_GRAPHQL_URL = "https://api.annict.com/graphql";

type GraphQLErrorShape = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorShape[];
};

export async function getAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.accessToken ?? null;
}

export async function serverFetchGraphQL<T>(
  document: DocumentNode,
  variables?: Record<string, unknown>,
): Promise<T> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(ANNICT_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Annict GraphQL HTTP ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(", "));
  }
  if (!json.data) {
    throw new Error("Annict GraphQL returned empty data");
  }

  return json.data;
}
