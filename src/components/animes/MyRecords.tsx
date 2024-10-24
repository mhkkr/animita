'use client';

import { useQuery } from '@apollo/client';
import { viewerRecordsGql } from '~/features/apollo/gql/query/viewerRecordsGql';
import type { ViewerRecordsQuery } from '~/features/apollo/generated-types';

import * as Record from '~/components/animes/AnimeEpisode';
import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

export default function MyRecords() {
  const { data: user, loading: loading, error: error } = useQuery<ViewerRecordsQuery>(viewerRecordsGql, {
    variables: {
      first: Const.MY_RECORDS_LIMIT
    }
  });

  return (
    <div className="mt-4">
      <p className="px-4 text-lg font-bold">直近の{Const.MY_RECORDS_LIMIT}件の記録</p>

      {loading && <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="p-4 text-red-500">{error.message}</p>}

      {!(loading || error) && (
        <div className='
          mt-2 grid text-sm [&_*]:text-left
          [&_button]:flex [&_button]:gap-2 [&_button]:justify-between [&_button]:px-4 [&_button]:py-1 [&_button]:border-t [&_button]:dark:border-stone-700
          hover:[&_button]:bg-black/10 hover:[&_button]:dark:bg-white/20
          [&_div]:flex [&_div]:self-center [&_div]:gap-2 [&_div]:opacity-70 [&_div]:text-xs
          first:[&_div_span]:whitespace-nowrap
        '>
          {user?.viewer?.records?.edges?.map(edge => {
            const recode = edge?.node;
            if (recode && recode.episode) {
              return (
                <Record.ToggleButton key={`r-${recode.annictId}`} workAnnictId={recode.episode.work.annictId} episodeAnnictId={recode.episode.annictId}>
                  <p>{recode.episode.title || Const.EPISODE_TITLE_UNDEFINED}</p>
                  <div>
                    <span>{recode.episode.numberText}</span>
                    <span>{recode.episode.work.title}</span>
                  </div>
                </Record.ToggleButton>
              )
            }
          })}
        </div>
      )}
    </div>
  );
}