'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@apollo/client';
import { viewerRecordsGql } from '~/features/apollo/gql/query/viewerRecordsGql';
// import type { SearchEpisodesQuery, ViewerUserQuery, Work, Episode, Record } from '~/features/apollo/generated-types';

import * as Record from '~/components/animes/AnimeRecords';
import { RingSpinner } from '~/components/spinners/Spinner';

export default function MyRecords() {
  const { data: user, loading: loading, error: error } = useQuery(viewerRecordsGql);

  return (
    <section className="mt-8">
      <h2 className="px-4 text-lg font-bold">エピソード記録（{!user ? 0 : user.viewer.records.edges.length.toLocaleString()}件）</h2>

      {loading && <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="p-4 text-red-500">{error.message}</p>}

      {!(loading || error) && (
        <div className='
          mt-2 flex flex-col-reverse text-sm [&_*]:text-left
          [&_button]:flex [&_button]:gap-2 [&_button]:justify-between [&_button]:px-4 [&_button]:py-1 [&_button]:border-t [&_button]:dark:border-white/25
          hover:[&_button]:bg-black/20 hover:[&_button]:dark:bg-white/20
          [&_div]:flex [&_div]:self-center [&_div]:gap-2 [&_div]:opacity-70 [&_div]:text-xs
          first:[&_div_span]:whitespace-nowrap
        '>
          {user.viewer.records.edges.map(edge => {
            const recode = edge.node;
            if (recode && recode.episode) {
              return (
                <Record.ToggleButton key={`r-${recode.annictId}`} workAnnictId={recode.episode.work.annictId} episodeAnnictId={recode.episode.annictId} type="button">
                  <p>{recode.episode.title || "未定"}</p>
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
    </section>
  );
}