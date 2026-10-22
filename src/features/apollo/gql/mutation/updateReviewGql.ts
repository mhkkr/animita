import { gql } from "@apollo/client";

import { workReviewFields, type WorkReview } from "~/features/apollo/gql/query/workReviewsGql";
import type { ReviewRatingVariables } from "~/features/apollo/gql/mutation/createReviewGql";

export type UpdateReviewMutationVariables = ReviewRatingVariables & {
  reviewId: string;
  body: string;
};

export type UpdateReviewMutation = {
  updateReview?: {
    review?: WorkReview | null;
  } | null;
};

export const updateReviewGql = gql`
  mutation updateReview(
    $reviewId: ID!
    $body: String!
    $ratingOverallState: RatingState
    $ratingAnimationState: RatingState
    $ratingCharacterState: RatingState
    $ratingStoryState: RatingState
    $ratingMusicState: RatingState
  ) {
    updateReview(
      input: {
        reviewId: $reviewId
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
