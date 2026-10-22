'use client';

import { useQuery } from '@apollo/client/react';
import { viewerRecordsGql } from '~/features/apollo/gql/query/viewerRecordsGql';
import type { ViewerRecordsQuery } from '~/features/apollo/generated-types';

import { RecordLink } from '~/components/animes/AnimeEpisode';
import Icons from '~/components/icons/Icons';
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
        <div className='mt-2 grid text-sm'>
          {user?.viewer?.records?.edges?.map(edge => {
            const record = edge?.node;
            if (!record) {
              return null;
            }
            const ratingState = Const.RATING_STATE_LIST.find(RATINGSTATE => RATINGSTATE.id === record.ratingState);
            const statusState = Const.STATUS_STATE_LIST.find(state => state.id === record.episode?.work.viewerStatusState);
            if (record && record.episode) {
              return (
                <RecordLink
                  key={`r-${record.annictId}`}
                  className='flex gap-2 px-4 py-1 border-t dark:border-stone-700 hover:bg-black/10 hover:dark:bg-white/20 '
                  workAnnictId={record.episode.work.annictId}
                  episodeAnnictId={record.episode.annictId}
                >
                  {statusState && (
                    <Icons
                      id={`${statusState.id}_CURRENT`}
                      type="status_state"
                      className={`flex-none text-[1.25em] mt-[.075em] ${ratingState?.color ?? ""}`}
                    />
                  )}
                  <p className='grow text-left'>{record.episode.title || Const.EPISODE_TITLE_UNDEFINED}</p>
                  <div className='flex-none mt-[.2em] w-2/5 flex gap-2 opacity-70 text-left text-xs'>
                    <span className='whitespace-nowrap'>#{String(record.episode.number).padStart(2, '0')}</span>
                    <span>{record.episode.work.title}</span>
                  </div>
                </RecordLink>
              )
            }
          })}
        </div>
      )}
    </div>
  );
}