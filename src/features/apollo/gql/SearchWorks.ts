import { gql } from '@apollo/client';

export const SearchWorks = gql`
  query {
    searchWorks(
      annictIds: [9423]
    ) {
      nodes {
        title
      }
    }
  }
`;