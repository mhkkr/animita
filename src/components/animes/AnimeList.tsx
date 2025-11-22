'use client';

import Link from 'next/link';

import type { LibraryEntriesQuery, LibraryEntry, ViewerUserQuery } from '~/features/apollo/generated-types';
import { useLibraryEntries } from '~/features/apollo/hooks/useLibraryEntries';
import { useQuery } from '@apollo/client/react';
import { viewerUserGql } from '~/features/apollo/gql/query/viewerUserGql';

import { useAtom } from 'jotai';
import { statusStateIdAtom } from '~/atoms/statusStateIdAtom';
import { tabStateAtom } from '~/atoms/tabStateAtom';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';
import * as AnimeEpisode from '~/components/animes/AnimeEpisode';
import Thumbnail from '~/components/animes/AnimeThumbnail';

import Const from '~/constants';

type EntriesDate = {
  day: string,
  list: LibraryEntry[]
};

function SwitchTab({ value, label }: { value: string, label: string }) {
  const [statusStateId] = useAtom(statusStateIdAtom);
  const [tabState, setTabState] = useAtom(tabStateAtom);

  const tab = tabState.find(tab => tab.id === statusStateId);
  const tabIndex = tabState.findIndex(tab => tab.id === statusStateId);
  const deliveredTabDeep: { id: string; value: string; }[] = JSON.parse(JSON.stringify(tabState));

  return (
    <button
      onClick={() => {
        deliveredTabDeep[tabIndex].value = value;
        setTabState(deliveredTabDeep);
        document.documentElement.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`
        relative w-1/2 px-4 py-3
        after:content-[''] after:block after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-1 after:bg-annict-100 after:rounded-full
        ${tab?.value === value ? 'font-bold' : 'dark:text-white/70 after:hidden'}
      `}
      type="button"
    >{label}</button>
  );
}

function Detail({ entry, now }: { entry: EntriesDate, now: number }) {
  if (entry.list.length === 0) {
    return <p className="p-4 dark:text-white/70">エピソードがありません！</p>;
  }
  
  return (
    <ul>
      {entry.list?.map((entry: LibraryEntry) => {
        const startedAt = new Date(entry?.nextProgram?.startedAt);
        const isViewable = now > startedAt.getTime();
        return (
          <li key={entry?.work.annictId} className={`flex gap-4 p-4 border-b dark:border-stone-700`}>
            <div className="flex-shrink-0 w-28">
              <Link href={`/anime/${entry?.work.annictId}`}>
                <Thumbnail work={entry?.work} view="list" />
              </Link>
              <p className="mt-2 text-center text-xs dark:text-white/70">{entry?.nextProgram?.channel.name}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm dark:text-white/70"><DisplayDate date={startedAt} /></p>
              <p className="mt-1 font-bold"><Link className="inline-block" href={`/anime/${entry?.work.annictId}`}>{entry?.work.title}</Link></p>
              {(() => {
                const episodes = (entry?.work.episodes?.nodes ? Array.from(entry.work.episodes.nodes) : []) as Array<{ annictId?: number | null, sortNumber?: number | null, viewerDidTrack?: boolean | null }>;
                const sortedEpisodes = [...episodes].sort((a, b) => (a?.sortNumber as number || 0) - (b?.sortNumber as number || 0));
                
                // 同じチャンネルのプログラムを取得
                const channelId = entry?.nextProgram?.channel.annictId;
                const channelPrograms = entry?.work.programs?.nodes?.filter(program => program?.channel.annictId === channelId) || [];
                
                // 視聴可能かつ未視聴のエピソードをカウント
                const unwatchedCount = sortedEpisodes.filter((episode, episodeIndex) => {
                  if (episode?.viewerDidTrack) return false; // 視聴済みは除外
                  
                  const program = channelPrograms[episodeIndex];
                  if (!program) return false; // プログラムがない場合は除外
                  
                  const programStartedAt = new Date(program?.startedAt);
                  return now > programStartedAt.getTime(); // 視聴可能なもののみ
                }).length;
                
                return unwatchedCount > 0 ? (
                  <p className="mt-1 text-sm dark:text-white/70">未視聴：{unwatchedCount}話</p>
                ) : null;
              })()}
              <div className={`${isViewable ? '' : 'cursor-text'}`}>
                <AnimeEpisode.ToggleButton
                  className={`
                    flex w-full text-sm
                    ${isViewable ? 'mt-1.5 px-4 py-2 border dark:border-white/30 rounded-3xl' : 'mt-1 pointer-events-none'}
                  `}
                  workAnnictId={entry?.work.annictId}
                  episodeAnnictId={entry?.nextProgram?.episode?.annictId}
                  disabled={isViewable ? false : true}
                >
                  <span className="flex-shrink-0 mr-2">{entry?.nextProgram?.episode.numberText}</span>
                  <span className="flex-1 text-left">{entry?.nextProgram?.episode.title || Const.EPISODE_TITLE_UNDEFINED}</span>
                </AnimeEpisode.ToggleButton>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function NotEntry() {
  return (
    <div className="px-4 pt-6 dark:text-white/70">
      <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
      <p className="text-center">エピソードがありません！</p>
    </div>
  );
}

function SimpleList({ statusStateId }: { statusStateId: string }) {
  const { data: user, loading: ul, error: ue } = useQuery<ViewerUserQuery>(viewerUserGql);

  if (ul) {
    return <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>;
  }
  if (ue) {
    return <p className="p-4 text-red-500">{ue?.message}</p>;
  }

  const username = user?.viewer?.username;
  if (!username) {
    return (
      <div className="px-4 pt-6 dark:text-white/70">
        <p className="text-center">ユーザー情報を取得できませんでした</p>
      </div>
    );
  }

  // ステータスに応じたURLを決定
  const getAnnictUrl = (statusId: string): string => {
    switch (statusId) {
      case 'WATCHED':
        return `https://annict.com/@${username}/watched`;
      case 'ON_HOLD':
        return `https://annict.com/@${username}/on_hold`;
      case 'STOP_WATCHING':
        return `https://annict.com/@${username}/stop_watching`;
      default:
        return `https://annict.com/@${username}`;
    }
  };

  return (
    <div className="px-4 pt-6">
      <a
        href={getAnnictUrl(statusStateId)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 px-6 border dark:border-white/30 rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      >
        <Icons id="open_in_new" type="link" className="text-[1.25em]" />
        <span className="font-bold">Annictで確認してください</span>
      </a>
    </div>
  );
}

function DeliveredList({ entriesDate, now }: { entriesDate: EntriesDate[], now: number }) {
  const [statusStateId] = useAtom(statusStateIdAtom);
  const [tabState] = useAtom(tabStateAtom);
  const tab = tabState.find(tab => tab.id === statusStateId);

  // 視聴可能
  const deliveredEntry = entriesDate.find(entry => entry.day === '視聴可能');

  if (!deliveredEntry) return <></>;

  return (
    <div className={`${tab?.value === 'delivered' ? '' : 'hidden'}`}>
      {deliveredEntry.list.length === 0 ? (
        <NotEntry />
      ) : (
        <Detail entry={deliveredEntry} now={now} />
      )}
    </div>
  );
}

function UnDeliveredList({ entriesDate, now }: { entriesDate: EntriesDate[], now: number }) {
  const [statusStateId] = useAtom(statusStateIdAtom);
  const [tabState] = useAtom(tabStateAtom);
  const tab = tabState.find(tab => tab.id === statusStateId);

  // 予定を曜日で並び替え
  const undeliveredEntries = (
    entriesDate

    // 今日の曜日から最後まで取得
    .slice(new Date().getDay() + 1)
    
    // 視聴可能の次から今日の曜日の前まで取得
    .concat(entriesDate.slice(1, new Date().getDay() + 1))
  );

  return (
    <div className={`${tab?.value === 'undelivered' ? '' : 'hidden'}`}>
      {undeliveredEntries.filter(entry => entry.list.length).length === 0 ? (
        <NotEntry />
      ) : (
        undeliveredEntries.map(entry => (
          <div key={entry.day} className="mt-12 first:mt-6">
            <div className="border-b dark:border-stone-700 p-4 text-lg font-bold">{entry.day}曜日</div>
            <Detail entry={entry} now={now} />
          </div>
        ))
      )}
    </div>
  );
}

function EntryList({ data }: { data: LibraryEntriesQuery | undefined }) {
  const now = Date.now();

  // 次の話があるものだけに絞る
  const hasNextPrograms = data?.viewer?.libraryEntries?.nodes?.filter(node => node?.nextProgram !== null);

  // 放映配信開始日時順に並び替え
  hasNextPrograms?.sort((a, b) => new Date(a?.nextProgram?.startedAt).getTime() - new Date(b?.nextProgram?.startedAt).getTime());

  // 視聴可能または予定曜日ごとに格納する
  const entriesDate: EntriesDate[] = [
    { day: '視聴可能', list: [] },
    { day: '日', list: [] },
    { day: '月', list: [] },
    { day: '火', list: [] },
    { day: '水', list: [] },
    { day: '木', list: [] },
    { day: '金', list: [] },
    { day: '土', list: [] }
  ];
  hasNextPrograms?.forEach(program => {
    const startedAt = new Date(program?.nextProgram?.startedAt);
    const isViewable = now > startedAt.getTime();
    const day = ['日', '月', '火', '水', '木', '金', '土'][startedAt.getDay()];
    const entry = isViewable ? entriesDate.find(entry => entry.day === '視聴可能') : entriesDate.find(entry => entry.day === day);
    if (entry && program) {
      entry.list.push(program as LibraryEntry);
    }
  });

  return (
    <>
      <DeliveredList entriesDate={entriesDate} now={now} />
      <UnDeliveredList entriesDate={entriesDate} now={now} />
    </>
  );
}

export default function AnimeList() {
  const [statusStateId] = useAtom(statusStateIdAtom);
  const STATE = Const.STATUS_STATE_LIST.find(state => state.id === statusStateId);
  
  // 見てる、見たいは詳細な表示、それ以外は簡素な表示
  const isSimpleView = statusStateId === 'WATCHED' || statusStateId === 'ON_HOLD' || statusStateId === 'STOP_WATCHING';
  
  const { data, loading, error } = useLibraryEntries({
    states: [statusStateId],
    skip: isSimpleView
  });

  return (
    <div className="relative">
      <header className="sticky top-0 dark:bg-black/60 backdrop-blur-md">
        <h1 className="flex items-center justify-center px-4 py-3 text-xl font-bold">
          <Icons id={`${STATE?.id}_CURRENT`} type="status_state" className="mr-2 text-[1.5em]" />
          <span>{STATE?.label}</span>
        </h1>
        {!isSimpleView && (
          <div className="flex border-b dark:border-stone-700">
            <SwitchTab value="delivered" label="視聴可能" />
            <SwitchTab value="undelivered" label="予定" />
          </div>
        )}
      </header>
      
      {isSimpleView ? (
        <SimpleList statusStateId={statusStateId} />
      ) : (
        <>
          {loading && <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}
          {error && <p className="p-4 text-red-500">{error.message}</p>}
          {!(loading || error) && <EntryList data={data} />}
        </>
      )}
    </div>
  );
}