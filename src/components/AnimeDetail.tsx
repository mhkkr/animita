'use client';

import { useLayoutEffect } from 'react';

import { useQuery } from '@apollo/client';
import { searchWorksGql } from '~/features/apollo/gql/searchWorksGql';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import type { SearchWorksQuery, Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useSetRecoilState } from 'recoil';
import { statusStateAtom } from '~/atoms/statusStateAtom';

import BackButton from '~/components/buttons/BackButton';
import { RingSpinner } from '~/components/spinners/Spinner';

import Episodes from '~/components/AnimeEpisodes';
import Info from '~/components/AnimeInfo';

import Const from '~/constants';

const statusStateArray: string[] = [];
Const.STATUSSTATE_LIST.map(state => statusStateArray.push(state.id));

// TODO: setStatusState を実行したいだけで、この実装は苦しい気がする…。
function SetStatusState({ work }: { work: Work }) {
  const setStatusState = useSetRecoilState(statusStateAtom);
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);

  useLayoutEffect(() => {
    if (entry?.status?.state) {
      setStatusState(entry?.status?.state);
    }
  }, [entry]);
  
  if (loading) return <></>;
  if (error) { console.error(error); return <></>; }
  return <></>;
}

export default function AnimeDetail({ annictId }: { annictId: number }) {
  const { data, loading, error } = useQuery<SearchWorksQuery>(searchWorksGql, {
    variables: { annictIds: [annictId] }
  });
  const work = data?.searchWorks?.nodes ? (data?.searchWorks?.nodes[0] as Work) : null;

  return (
    <>
      <p><BackButton /></p>

      {loading && <div className="pt-12 border-t dark:border-white/25 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="px-4 pt-6 dark:text-white/70 border-t dark:border-white/25">{error.message}</p>}

      {!(loading || error) &&
        <>
          {!work && 
            <div className="px-4 pt-6 dark:text-white/70 border-t dark:border-white/25">
              <span className="!table mx-auto mb-4 material-symbols-outlined material-symbols-outlined--fill">unknown_document</span>
              <p className="text-center">詳細取得できませんでした。</p>
            </div>
          }
          {work && 
            <>
              <SetStatusState work={work} />
              <Info work={work} />
              <div className="mt-6">
                <Episodes work={work} />
              </div>
            </>
          }
        </>
      }
    </>
  );
}