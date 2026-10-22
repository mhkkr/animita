import { gql } from "@apollo/client";

import type { RatingState } from "~/features/apollo/generated-types";
import { workReviewFields, type WorkReview } from "~/features/apollo/gql/query/workReviewsGql";

export type ReviewRatingVariables = {
  ratingOverallState?: RatingState;
  ratingAnimationState?: RatingState;
  ratingCharacterState?: RatingState;
  ratingStoryState?: RatingState;
  ratingMusicState?: RatingState;
};

export type CreateReviewMutationVariables = ReviewRatingVariables & {
  workId: string;
  body: string;
};

export type CreateReviewMutation = {
  createReview?: {
    review?: WorkReview | null;
  } | null;
};

export const createReviewGql = gql`
  mutation createReview(
    $workId: ID!
    $body: String!
    $ratingOverallState: RatingState
    $ratingAnimationState: RatingState
    $ratingCharacterState: RatingState
    $ratingStoryState: RatingState
    $ratingMusicState: RatingState
  ) {
    createReview(
      input: {
        workId: $workId
        body: $body
        ratingOverallState: $ratingOverallState
        ratingAnimationState: $ratingAnimationState
        ratingCharacterState: $ratingCharacterState
        ratingStoryState: $ratingStoryState
        ratingMusicState: $ratingMusicState
      }
    ) {
      review {
        ...WorkReviewFields
      }
    }
  }
  ${workReviewFields}
`;
