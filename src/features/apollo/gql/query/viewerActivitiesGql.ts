import { gql, type TypedDocumentNode } from '@apollo/client';

import type { RatingState, StatusState } from '~/features/apollo/generated-types';

type WorkRef = {
  title: string;
  annictId: number;
  viewerStatusState?: StatusState | null;
};

export type ActivityRecord = {
  __typename: 'Record';
  annictId: number;
  ratingState?: RatingState | null;
  episode: {
    title?: string | null;
    number?: number | null;
    annictId: number;
    work: WorkRef;
  };
};

export type ActivityMultipleRecord = {
  __typename: 'MultipleRecord';
  annictId: number;
  work: WorkRef;
  records?: {
    pageInfo: { hasNextPage: boolean };
    nodes?: Array<{
      annictId: number;
      episode?: {
        title?: string | null;
        number?: number | null;
        annictId: number;
      } | null;
    } | null> | null;
  } | null;
};

export type ActivityReview = {
  __typename: 'Review';
  annictId: number;
  title?: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  ratingOverallState?: RatingState | null;
  ratingAnimationState?: RatingState | null;
  ratingCharacterState?: RatingState | null;
  ratingStoryState?: RatingState | null;
  ratingMusicState?: RatingState | null;
  work: WorkRef;
};

export type ActivityStatus = {
  __typename: 'Status';
  annictId: number;
  state: StatusState;
  work: {
    title: string;
    annictId: number;
    viewerStatusState?: StatusState | null;
  };
};

export type ActivityItem = ActivityRecord | ActivityMultipleRecord | ActivityReview | ActivityStatus;

export type ViewerActivitiesData = {
  viewer?: {
    username: string;
    activities?: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string | null;
      };
      edges?: Array<{
        item?: ActivityItem | null;
      } | null> | null;
    } | null;
  } | null;
};

export type ViewerActivitiesVariables = {
  first: number;
  after?: string | null;
};

export const viewerActivitiesGql: TypedDocumentNode<ViewerActivitiesData, ViewerActivitiesVariables> = gql`
  query viewerActivities($first: Int!, $after: String) {
    viewer {
      username
      activities(first: $first, after: $after, orderBy: { field: CREATED_AT, direction: DESC }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          item {
            __typename
            ... on Record {
              annictId
              ratingState
              episode {
                title
                number
                annictId
                work {
                  title
                  annictId
                  viewerStatusState
                }
              }
            }
            ... on MultipleRecord {
              annictId
              work {
                title
                annictId
                viewerStatusState
              }
              records(first: 50) {
                pageInfo {
                  hasNextPage
                }
                nodes {
                  annictId
                  episode {
                    title
                    number
                    annictId
                  }
                }
              }
            }
            ... on Review {
              annictId
              title
              body
              createdAt
              updatedAt
              ratingOverallState
              ratingAnimationState
              ratingCharacterState
              ratingStoryState
              ratingMusicState
              work {
                title
                annictId
                viewerStatusState
              }
            }
            ... on Status {
              annictId
              state
              work {
                title
                annictId
                viewerStatusState
              }
            }
          }
        }
      }
    }
  }
`;
