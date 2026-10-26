import { NextRequest, NextResponse } from "next/server";

import { fetchAnnictGraphQL, getAccessToken } from "~/features/apollo/server";
import type { Media, SeasonName, StatusState } from "~/features/apollo/generated-types";
import { isAllowedRequest } from "~/libs/allowedOrigin";
import { parseRelatedWorks } from "~/libs/relatedWorks";

export const dynamic = "force-dynamic";

const DETAILS_QUERY = `
  query relatedWorkDetails($annictIds: [Int!], $first: Int) {
    searchWorks(annictIds: $annictIds, first: $first) {
      nodes {
        annictId
        title
        media
        seasonName
        seasonYear
        viewerStatusState
        malAnimeId
        watchersCount
        reviewsCount
        image {
          facebookOgImageUrl
        }
      }
    }
  }
`;

type WorkDetails = {
  annictId: number;
  title: string;
  media: Media;
  seasonName?: SeasonName | null;
  seasonYear?: number | null;
  viewerStatusState?: StatusState | null;
  malAnimeId?: string | null;
  watchersCount?: number | null;
  reviewsCount?: number | null;
  image?: {
    facebookOgImageUrl?: string | null;
  } | null;
};

type DetailsQuery = {
  searchWorks?: {
    nodes?: Array<WorkDetails | null> | null;
  } | null;
};

async function fetchWorkDetails(accessToken: string, annictIds: number[]) {
  const details = new Map<number, WorkDetails>();
  const chunkSize = 20;

  for (let index = 0; index < annictIds.length; index += chunkSize) {
    const chunk = annictIds.slice(index, index + chunkSize);
    const result = await fetchAnnictGraphQL<DetailsQuery>(accessToken, {
      query: DETAILS_QUERY,
      variables: { annictIds: chunk, first: chunk.length },
      operationName: "relatedWorkDetails",
    });
    if (!result.ok) continue;

    for (const node of result.json.data?.searchWorks?.nodes ?? []) {
      if (node) details.set(node.annictId, node);
    }
  }

  return details;
}

export async function GET(request: NextRequest) {
  if (!isAllowedRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const annictId = Number(request.nextUrl.searchParams.get("annictId"));
  if (!Number.isInteger(annictId) || annictId <= 0) {
    return NextResponse.json({ error: "Invalid annictId" }, { status: 400 });
  }

  const page = await fetch(`https://annict.com/works/${annictId}/related_works`, {
    headers: {
      Accept: "text/html",
      "User-Agent": "animita",
    },
    redirect: "manual",
    cache: "no-store",
  });
  if (!page.ok) {
    return NextResponse.json({ series: [] });
  }

  const parsed = parseRelatedWorks(await page.text());
  const ids = Array.from(new Set(parsed.flatMap((item) => item.works.map((work) => work.annictId))));
  const details = ids.length > 0 ? await fetchWorkDetails(accessToken, ids) : new Map<number, WorkDetails>();

  const series = parsed.flatMap((item) => {
    const works = item.works.flatMap((work) => {
      if (work.annictId === annictId) return [];
      const detail = details.get(work.annictId);
      return [{
        annictId: work.annictId,
        title: detail?.title || work.title,
        media: detail?.media ?? null,
        seasonName: detail?.seasonName ?? null,
        seasonYear: detail?.seasonYear ?? null,
        viewerStatusState: detail?.viewerStatusState ?? null,
        malAnimeId: detail?.malAnimeId ?? null,
        ogpUrl: detail?.image?.facebookOgImageUrl ?? null,
        watchersCount: detail?.watchersCount ?? null,
        reviewsCount: detail?.reviewsCount ?? null,
      }];
    });
    if (works.length === 0) return [];
    return [{ name: item.name, works }];
  });

  return NextResponse.json({ series });
}
