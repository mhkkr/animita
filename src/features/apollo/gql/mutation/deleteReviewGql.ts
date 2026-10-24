import { gql, type TypedDocumentNode } from "@apollo/client";

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

export const deleteReviewGql: TypedDocumentNode<DeleteReviewMutation, DeleteReviewMutationVariables> = gql`
  mutation deleteReview($reviewId: ID!) {
    deleteReview(input: { reviewId: $reviewId }) {
      work {
        id
      }
    }
  }
`;
