'use client';

import { useLayoutEffect } from 'react';

import { useQuery } from '@apollo/client';
import { searchWorksGql } from '~/features/apollo/gql/query/searchWorksGql';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { SearchWorksQuery, Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useSetRecoilState } from 'recoil';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';

import Icons from '~/components/icons/Icons';

import BackButton from '~/components/buttons/BackButton';
import { RingSpinner } from '~/components/spinners/Spinner';

import Episodes from '~/components/AnimeEpisodes';
import Info from '~/components/AnimeInfo';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUSSTATE_LIST.map(state => statusStateIdArray.push(state.id));

// TODO: setStatusStateId を実行したいだけで、この実装は苦しい気がする…。
function SetStatusState({ work }: { work: Work }) {
  const setStatusStateId = useSetRecoilState(statusStateIdAtom);
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateIdArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);

  useLayoutEffect(() => {
    if (entry?.status?.state) {
      setStatusStateId(entry?.status?.state);
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
      {error && <p className="px-4 pt-6 dark:text-white/70 border-t text-red-500">{error.message}</p>}

      {!(loading || error) &&
        <>
          {!work && 
            <div className="px-4 pt-6 dark:text-white/70 border-t dark:border-white/25">
              <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
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