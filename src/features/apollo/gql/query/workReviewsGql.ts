import { gql } from "@apollo/client";

import type { RatingState } from "~/features/apollo/generated-types";

export type WorkReview = {
  id: string;
  annictId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  ratingOverallState?: RatingState | null;
  ratingAnimationState?: RatingState | null;
  ratingCharacterState?: RatingState | null;
  ratingStoryState?: RatingState | null;
  ratingMusicState?: RatingState | null;
  user: {
    annictId: number;
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
};

export type WorkReviewsQuery = {
  searchWorks?: {
    nodes?: Array<{
      id: string;
      annictId: number;
      reviewsCount: number;
      reviews?: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor?: string | null;
        };
        nodes?: Array<WorkReview | null> | null;
      } | null;
    } | null> | null;
  } | null;
};

export type WorkReviewsQueryVariables = {
  annictIds: number[];
  first: number;
  after?: string | null;
};

export const workReviewFields = gql`
  fragment WorkReviewFields on Review {
    id
    annictId
    body
    createdAt
    updatedAt
    likesCount
    ratingOverallState
    ratingAnimationState
    ratingCharacterState
    ratingStoryState
    ratingMusicState
    user {
      annictId
      name
      username
      avatarUrl
    }
  }
`;

export const workReviewsGql = gql`
  query workReviews($annictIds: [Int!], $first: Int!, $after: String) {
    searchWorks(annictIds: $annictIds) {
      nodes {
        id
        annictId
        reviewsCount
        reviews(first: $first, after: $after, orderBy: { field: CREATED_AT, direction: DESC }) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...WorkReviewFields
          }
        }
      }
    }
  }
  ${workReviewFields}
`;
