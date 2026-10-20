import { libraryEntriesGql } from "~/features/apollo/gql/query/libraryEntriesGql";
import { libraryEntryDetailGql } from "~/features/apollo/gql/query/libraryEntryDetailGql";
import { searchWorksGql } from "~/features/apollo/gql/query/searchWorksGql";
import { serverFetchGraphQL, getAccessToken } from "~/features/apollo/server";
import type {
  LibraryEntriesQuery,
  LibraryEntryDetailQuery,
  SearchWorksQuery,
  Work,
} from "~/features/apollo/generated-types";
import Const from "~/constants";

export type HomePageData = {
  entries: LibraryEntriesQuery;
};

export type AnimeDetailPageData = {
  work: Work | null;
  libraryEntries: LibraryEntryDetailQuery | null;
  error?: string;
};

/** 一覧からの遷移で多い状態だけ並列取得（重い WATCHED はシーズン指定のフォールバックへ） */
const DETAIL_LOOKUP_STATES = ["WATCHING", "WANNA_WATCH"] as const;

export async function loadHomePageData(): Promise<HomePageData | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const entries = await serverFetchGraphQL<LibraryEntriesQuery>(libraryEntriesGql, {
    states: ["WATCHING", "WANNA_WATCH"],
    seasons: [],
  });

  return { entries };
}

function findLibraryEntry(libraryEntries: LibraryEntryDetailQuery | null, annictId: number) {
  return libraryEntries?.viewer?.libraryEntries?.nodes?.find(
    (node) => node?.work.annictId === annictId,
  );
}

export async function loadAnimeDetailPageData(annictId: number): Promise<AnimeDetailPageData | null> {
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
        states: [...DETAIL_LOOKUP_STATES],
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
      const states = Const.STATUS_STATE_LIST.map((state) => state.id);
      libraryEntries = await serverFetchGraphQL<LibraryEntryDetailQuery>(libraryEntryDetailGql, {
        states,
        seasons,
      });
      entry = findLibraryEntry(libraryEntries, annictId);
    }

    if (libraryEntries && entry) {
      libraryEntries = {
        ...libraryEntries,
        viewer: {
          ...libraryEntries.viewer,
          libraryEntries: {
            ...libraryEntries.viewer?.libraryEntries,
            nodes: [entry],
          },
        },
      };
    } else if (libraryEntries) {
      libraryEntries = {
        ...libraryEntries,
        viewer: {
          ...libraryEntries.viewer,
          libraryEntries: {
            ...libraryEntries.viewer?.libraryEntries,
            nodes: [],
          },
        },
      };
    }

    return { work, libraryEntries };
  } catch (error) {
    const message = error instanceof Error ? error.message : "詳細の取得に失敗しました";
    return { work: null, libraryEntries: null, error: message };
  }
}
