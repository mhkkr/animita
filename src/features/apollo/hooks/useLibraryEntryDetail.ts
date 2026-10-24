import { useQuery } from "@apollo/client/react";

import { libraryEntryDetailGql } from "~/features/apollo/gql/query/libraryEntryDetailGql";
import type { StatusState } from "~/features/apollo/generated-types";
import { ALL_STATUS_STATE_IDS } from "~/libs/settings";

type UseLibraryEntryDetailOptions = {
  states?: string[];
  seasons?: string[];
  skip?: boolean;
};

/** 詳細ページ用の軽量 libraryEntries（work 配下の episodes/programs は含まない） */
export function useLibraryEntryDetail(options: UseLibraryEntryDetailOptions = {}) {
  const {
    states = ALL_STATUS_STATE_IDS,
    seasons = [],
    skip = false,
  } = options;

  return useQuery(libraryEntryDetailGql, {
    variables: { states: states as StatusState[], seasons },
    skip,
  });
}
