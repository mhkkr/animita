import { useQuery } from '@apollo/client/react';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { LibraryEntriesQuery } from '~/features/apollo/generated-types';
import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUS_STATE_LIST.map(state => statusStateIdArray.push(state.id));

type UseLibraryEntriesOptions = {
  states?: string[];
  seasons?: string[];
  skip?: boolean;
};

export function useLibraryEntries(options: UseLibraryEntriesOptions = {}) {
  const { states = statusStateIdArray, seasons, skip = false } = options;

  return useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states,
      seasons: seasons || []
    },
    skip
  });
}

