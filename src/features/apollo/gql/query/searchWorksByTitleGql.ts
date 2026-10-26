import { gql, type TypedDocumentNode } from "@apollo/client";

import type { Media, SeasonName, StatusState } from "~/features/apollo/generated-types";

export type TitleSearchWork = {
  id: string;
  annictId: number;
  title: string;
  malAnimeId?: string | null;
  media: Media;
  image?: {
    facebookOgImageUrl?: string | null;
  } | null;
  seasonYear?: number | null;
  seasonName?: SeasonName | null;
  watchersCount: number;
  reviewsCount: number;
  viewerStatusState?: StatusState | null;
  programs?: {
    nodes?: Array<{
      channel: {
        name: string;
        channelGroup: { name: string };
      };
    } | null> | null;
  } | null;
};

export type SearchWorksByTitleQuery = {
  searchWorks?: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
    nodes?: Array<TitleSearchWork | null> | null;
  } | null;
};

export type SearchWorksByTitleQueryVariables = {
  titles: string[];
  first: number;
  after?: string | null;
};

export const searchWorksByTitleGql: TypedDocumentNode<
  SearchWorksByTitleQuery,
  SearchWorksByTitleQueryVariables
> = gql`
  query searchWorksByTitle($titles: [String!], $first: Int, $after: String) {
    searchWorks(
      titles: $titles
      first: $first
      after: $after
      orderBy: { field: WATCHERS_COUNT, direction: DESC }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        annictId
        title
        malAnimeId
        media
        image {
          facebookOgImageUrl
        }
        seasonYear
        seasonName
        watchersCount
        reviewsCount
        viewerStatusState
        programs(first: 100) {
          nodes {
            channel {
              name
              channelGroup {
                name
              }
            }
          }
        }
      }
    }
  }
`;
