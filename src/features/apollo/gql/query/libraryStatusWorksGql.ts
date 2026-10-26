import { gql, type TypedDocumentNode } from "@apollo/client";

import type { Media, SeasonName, StatusState } from "~/features/apollo/generated-types";

export type LibraryWork = {
  annictId: number;
  title: string;
  malAnimeId?: string | null;
  media: Media;
  seasonName?: SeasonName | null;
  seasonYear?: number | null;
  image?: {
    facebookOgImageUrl?: string | null;
  } | null;
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

export type LibraryStatusWorksQuery = {
  viewer?: {
    libraryEntries?: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string | null;
      };
      nodes?: Array<{
        id: string;
        work: LibraryWork;
      } | null> | null;
    } | null;
  } | null;
};

export type LibraryStatusWorksVariables = {
  states: StatusState[];
  first: number;
  after?: string | null;
};

export const libraryStatusWorksGql: TypedDocumentNode<
  LibraryStatusWorksQuery,
  LibraryStatusWorksVariables
> = gql`
  query libraryStatusWorks($states: [StatusState!], $first: Int, $after: String) {
    viewer {
      libraryEntries(
        states: $states
        first: $first
        after: $after
        orderBy: { field: LAST_TRACKED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          work {
            annictId
            title
            malAnimeId
            media
            seasonName
            seasonYear
            watchersCount
            reviewsCount
            viewerStatusState
            image {
              facebookOgImageUrl
            }
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
    }
  }
`;
