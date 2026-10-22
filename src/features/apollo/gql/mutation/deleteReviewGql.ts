import { gql } from "@apollo/client";

export type DeleteReviewMutationVariables = {
  reviewId: string;
};

export type DeleteReviewMutation = {
  deleteReview?: {
    work?: {
      id: string;
    } | null;
  } | null;
};

export const deleteReviewGql = gql`
  mutation deleteReview($reviewId: ID!) {
    deleteReview(input: { reviewId: $reviewId }) {
      work {
        id
      }
    }
  }
`;
