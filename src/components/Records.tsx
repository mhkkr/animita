'use client';

import { useQuery } from '@apollo/client';
import { searchEpisodesGql } from '~/features/apollo/gql/searchEpisodesGql';
import { searchWorksGql } from '~/features/apollo/gql/searchWorksGql';
import type { SearchWorksQuery, Work, SearchEpisodesQuery, Episode } from '~/features/apollo/generated-types';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { recordViewerAnnictIdAtom } from '~/atoms/recordViewerAnnictIdAtom';
import { recordViewerVisibilityAtom } from '~/atoms/recordViewerVisibilityAtom';

import { RingSpinner } from '~/components/spinners/Spinner';

import Profile from '~/components/Profile';

export {
  RecordOpenButton,
  RecordViewer
}

function RecordCloseOutsideArea({ className }: { className: string }) {
  const setRecordViewerVisibility = useSetRecoilState(recordViewerVisibilityAtom);

  return (
    <div 
      onClick={() => {
        setRecordViewerVisibility(false);
        document.body.style.overflow = '';
      }}
      className={className}
    >
    </div>
  );
}

function RecordCloseButton() {
  const [recordViewerVisibility, setRecordViewerVisibility] = useRecoilState(recordViewerVisibilityAtom);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && recordViewerVisibility) {
      setRecordViewerVisibility(false);
      document.body.style.overflow = '';
    }
  });

  return (
    <button 
      onClick={() => {
        setRecordViewerVisibility(false);
        document.body.style.overflow = '';
      }}
      className="flex w-full items-center justify-center px-4 py-3"
      aria-label="閉じる"
      type="button"
    >
      <span className="material-symbols-outlined">close</span>
      閉じる
    </button>
  );
}

function RecordOpenButton({ children, annictId, className, disabled }: { children: React.ReactNode, annictId: number | undefined, className: string, disabled?: boolean }) {
  const setRecordViewerAnnictId = useSetRecoilState(recordViewerAnnictIdAtom);
  const setRecordViewerVisibility = useSetRecoilState(recordViewerVisibilityAtom);

  return (
    <button 
      onClick={() => {
        setRecordViewerAnnictId(annictId ?? 0);
        setRecordViewerVisibility(true);
        document.body.style.overflow = 'hidden';
      }}
      className={className}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function DisplayProfile({ episode }: { episode: Episode }) {
  const { data, loading, error } = useQuery<SearchWorksQuery>(searchWorksGql, {
    variables: { annictIds: [episode.work.annictId] }
  });
  const work = data?.searchWorks?.nodes ? (data?.searchWorks?.nodes[0] as Work) : null;

  if (loading) return <></>;
  if (error) { console.error(error); return <></>; }

  return work ? <Profile work={work} /> : <></>;
}

function RecordViewerBody() {
  const [recordViewerAnnictId] = useRecoilState(recordViewerAnnictIdAtom);
  const [recordViewerVisibility] = useRecoilState(recordViewerVisibilityAtom);
  const { data, loading, error } = useQuery<SearchEpisodesQuery>(searchEpisodesGql, {
    variables: { annictIds: [recordViewerAnnictId] }
  });
  const episode = data?.searchEpisodes?.nodes ? (data?.searchEpisodes?.nodes[0] as Episode) : null;

  return (
    <div className={`
      fixed inset-0 dark:bg-gray-700/60 z-40
      ${recordViewerVisibility ? '' : 'hidden'}
    `}>
      <RecordCloseOutsideArea className="absolute inset-0" />
      <div className="relative max-w-4xl mx-auto">
        <div className="pl-48 pr-52">
          <RecordCloseOutsideArea className="absolute inset-0" />
          <div className="relative dark:bg-black min-h-screen border-l border-r dark:border-white/25 pb-12">
            {loading && <div className="pt-12 border-t dark:border-white/25 text-center text-5xl text-annict-100"><RingSpinner /></div>}
            {error && <p className="px-4 pt-6 dark:text-white/70 border-t dark:border-white/25">{error.message}</p>}

            {!(loading || error) &&
              <>
                <RecordCloseButton />
                {episode && <DisplayProfile episode={episode} />}
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordViewer() {
  const [recordViewerAnnictId] = useRecoilState(recordViewerAnnictIdAtom);
  if (!recordViewerAnnictId) return <></>;

  return <RecordViewerBody />;
}