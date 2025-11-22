import { useQuery } from '@apollo/client/react';
import { libraryEntriesSimpleGql } from '~/features/apollo/gql/query/libraryEntriesSimpleGql';
import type { LibraryEntriesSimpleQuery } from '~/features/apollo/generated-types';
import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUS_STATE_LIST.map(state => statusStateIdArray.push(state.id));

type UseLibraryEntriesSimpleOptions = {
  states?: string[];
  seasons?: string[];
  skip?: boolean;
};

export function useLibraryEntriesSimple(options: UseLibraryEntriesSimpleOptions = {}) {
  const { states = statusStateIdArray, seasons, skip = false } = options;

  return useQuery<LibraryEntriesSimpleQuery>(libraryEntriesSimpleGql, {
    variables: {
      states,
      seasons: seasons || []
    },
    skip
  });
}

