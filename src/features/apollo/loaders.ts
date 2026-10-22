import { cache } from "react";

import { libraryEntryDetailGql } from "~/features/apollo/gql/query/libraryEntryDetailGql";
import { searchWorksGql } from "~/features/apollo/gql/query/searchWorksGql";
import { serverFetchGraphQL, getAccessToken } from "~/features/apollo/server";
import type {
  LibraryEntryDetailQuery,
  SearchWorksQuery,
  Work,
} from "~/features/apollo/generated-types";
import {
  ALL_STATUS_STATE_IDS,
  DEFAULT_ANIME_LIST_STATUSES,
} from "~/libs/settings";

export type AnimeDetailPageData = {
  work: Work | null;
  libraryEntries: LibraryEntryDetailQuery | null;
  error?: string;
};

function findLibraryEntry(libraryEntries: LibraryEntryDetailQuery | null, annictId: number) {
  return libraryEntries?.viewer?.libraryEntries?.nodes?.find(
    (node) => node?.work.annictId === annictId,
  );
}

function narrowToEntry(
  libraryEntries: LibraryEntryDetailQuery,
  entry: NonNullable<ReturnType<typeof findLibraryEntry>> | undefined,
): LibraryEntryDetailQuery {
  return {
    ...libraryEntries,
    viewer: {
      ...libraryEntries.viewer,
      libraryEntries: {
        ...libraryEntries.viewer?.libraryEntries,
        nodes: entry ? [entry] : [],
      },
    },
  };
}

export const loadAnimeDetailPageData = cache(async (annictId: number): Promise<AnimeDetailPageData | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    const [worksData, quickLibraryEntries] = await Promise.all([
      serverFetchGraphQL<SearchWorksQuery>(searchWorksGql, {
        annictIds: [annictId],
      }),
      serverFetchGraphQL<LibraryEntryDetailQuery>(libraryEntryDetailGql, {
        states: [...DEFAULT_ANIME_LIST_STATUSES],
        seasons: [],
      }),
    ]);

    const work = (worksData.searchWorks?.nodes?.[0] as Work | undefined) ?? null;
    if (!work) {
      return { work: null, libraryEntries: null };
    }

    let libraryEntries = quickLibraryEntries;
    let entry = findLibraryEntry(libraryEntries, annictId);

    if (!entry && work.seasonYear && work.seasonName) {
      const seasons = [`${work.seasonYear}-${work.seasonName.toLowerCase()}`];
      libraryEntries = await serverFetchGraphQL<LibraryEntryDetailQuery>(libraryEntryDetailGql, {
        states: ALL_STATUS_STATE_IDS,
        seasons,
      });
      entry = findLibraryEntry(libraryEntries, annictId);
    }

    if (libraryEntries) {
      libraryEntries = narrowToEntry(libraryEntries, entry ?? undefined);
    }

    return { work, libraryEntries };
  } catch (error) {
    const message = error instanceof Error ? error.message : "詳細の取得に失敗しました";
    return { work: null, libraryEntries: null, error: message };
  }
});
