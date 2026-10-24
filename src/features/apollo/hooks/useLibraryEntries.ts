import { useQuery } from "@apollo/client/react";

import { libraryEntriesGql } from "~/features/apollo/gql/query/libraryEntriesGql";
import type { StatusState } from "~/features/apollo/generated-types";
import { DEFAULT_ANIME_LIST_STATUSES } from "~/libs/settings";

type UseLibraryEntriesOptions = {
  states?: string[];
  seasons?: string[];
  skip?: boolean;
};

export function useLibraryEntries(options: UseLibraryEntriesOptions = {}) {
  const {
    states = [...DEFAULT_ANIME_LIST_STATUSES],
    seasons = [],
    skip = false,
  } = options;

  return useQuery(libraryEntriesGql, {
    variables: { states: states as StatusState[], seasons },
    skip,
    // nextProgram は記録後にサーバー側で進む。キャッシュだけだと視聴中に戻っても前の話のままになる。
    fetchPolicy: "cache-and-network",
  });
}
