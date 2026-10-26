import { gql, type TypedDocumentNode } from "@apollo/client";

import type { Media, SeasonName, StatusState } from "~/features/apollo/generated-types";

export type SeasonWork = {
  id: string;
  annictId: number;
  title: string;
  malAnimeId?: string | null;
  media: Media;
  image?: {
    facebookOgImageUrl?: string | null;
  } | null;
  watchersCount: number;
  reviewsCount: number;
  viewerStatusState?: StatusState | null;
  seasonYear?: number | null;
  seasonName?: SeasonName | null;
};

export type CurrentSeasonWorksQuery = {
  searchWorks?: {
    nodes?: Array<SeasonWork | null> | null;
  } | null;
};

export type CurrentSeasonWorksQueryVariables = {
  seasons: string[];
  first: number;
};

export const currentSeasonWorksGql: TypedDocumentNode<
  CurrentSeasonWorksQuery,
  CurrentSeasonWorksQueryVariables
> = gql`
  query currentSeasonWorks($seasons: [String!], $first: Int) {
    searchWorks(
      seasons: $seasons
      first: $first
      orderBy: { field: WATCHERS_COUNT, direction: DESC }
    ) {
      nodes {
        id
        annictId
        title
        malAnimeId
        media
        image {
          facebookOgImageUrl
        }
        watchersCount
        reviewsCount
        viewerStatusState
        seasonYear
        seasonName
      }
    }
  }
`;
