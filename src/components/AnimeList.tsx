'use client';

import Link from 'next/link';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import type { LibraryEntriesQuery, LibraryEntry } from '~/features/apollo/generated-types';

import { useRecoilState } from 'recoil';
import { statusStateAtom } from '~/atoms/statusStateAtom';
import { tabStateAtom } from '~/atoms/tabStateAtom';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';
import * as Record from '~/components/AnimeRecords';

import Const from '~/constants';

type EntryEachDate = {
  day: string,
  list: LibraryEntry[]
};

function SwitchTab({ value, label }: { value: string, label: string }) {
  const [statusState] = useRecoilState(statusStateAtom);
  const [tabState, setTabState] = useRecoilState(tabStateAtom);

  const tab = tabState.find(tab => tab.id === statusState);
  const tabIndex = tabState.findIndex(tab => tab.id === statusState);
  
  const deliveredTabDeep: { id: string; value: string; }[] = JSON.parse(JSON.stringify(tabState));
  const tabChange = () => {
    deliveredTabDeep[tabIndex].value = value;
    setTabState(deliveredTabDeep);
  }

  return (
    <button
      onClick={() => {
        document.documentElement.scrollIntoView({ behavior: 'smooth' });
        tabChange();
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

function Detail({ entry, now }: { entry: EntryEachDate, now: number }) {
  if (entry.list.length === 0) {
    return <p className="p-4 dark:text-white/70">エピソードがありません！</p>;
  }
  return (
    <ul>
      {entry.list?.map((entry: LibraryEntry) => {
        const startedAt = new Date(entry?.nextProgram?.startedAt);
        const isViewable = now > startedAt.getTime();
        return (
          <li key={entry?.work.annictId} className={`flex gap-4 p-4 border-b dark:border-white/25`}>
            <div className="flex-shrink-0 w-28">
              <Link href={`/anime/${entry?.work.annictId}`}>
                <figure className="bg-gray-300">
                  <img className="mx-auto object-contain max-h-28 max-w-28" src={entry?.work?.image?.facebookOgImageUrl ?? ''} alt="作品サムネイル" loading="lazy" onError={e => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';
                  }} />
                </figure>
              </Link>
              <p className="mt-2 text-center text-xs dark:text-white/70">{entry?.nextProgram?.channel.name}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm dark:text-white/70"><DisplayDate date={startedAt} /></p>
              <p className="mt-1 font-bold"><Link href={`/anime/${entry?.work.annictId}`}>{entry?.work.title}</Link></p>
              <div className={`${isViewable ? '' : 'cursor-text'}`}>
                <Record.ToggleButton
                  className={`
                    flex w-full text-sm
                    ${isViewable ? 'mt-1.5 px-4 py-2 border dark:border-white/30 rounded-full' : 'mt-1 pointer-events-none'}
                  `}
                  workAnnictId={entry?.work.annictId}
                  episodeAnnictId={entry?.nextProgram?.episode?.annictId}
                  disabled={isViewable ? false : true}
                >
                  <span className="flex-shrink-0 mr-2">{entry?.nextProgram?.episode.numberText}</span>
                  <span className="flex-1 text-left">{entry?.nextProgram?.episode.title || '未定'}</span>
                </Record.ToggleButton>
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
      <span className="!table mx-auto mb-4 material-symbols-outlined material-symbols-outlined--fill">check_circle</span>
      <p className="text-center">エピソードがありません！</p>
    </div>
  );
}

function DeliveredList({ entryEachDate, now }: { entryEachDate: EntryEachDate[], now: number }) {
  const [statusState] = useRecoilState(statusStateAtom);
  const [tabState] = useRecoilState(tabStateAtom);
  const tab = tabState.find(tab => tab.id === statusState);

  // 配信済み
  const deliveredEntry = entryEachDate.find(entry => entry.day === '配信済み');

  if (!deliveredEntry) return <></>;

  return (
    <div className={`${tab?.value === 'delivered' ? '' : 'hidden'}`}>
      {deliveredEntry.list.length === 0 ?
        <NotEntry /> :
        <Detail entry={deliveredEntry} now={now} />
      }
    </div>
  );
}

function UnDeliveredList({ entryEachDate, now }: { entryEachDate: EntryEachDate[], now: number }) {
  const [statusState] = useRecoilState(statusStateAtom);
  const [tabState] = useRecoilState(tabStateAtom);
  const tab = tabState.find(tab => tab.id === statusState);

  // 未配信を曜日で並び替え
  const undeliveredEntries =
    (
      // 今日の曜日から最後まで取得
      entryEachDate.slice(new Date().getDay() + 1)
      // 配信済みの次から今日の曜日の前まで取得
      .concat(entryEachDate.slice(1, new Date().getDay() + 1))
    );

  return (
    <div className={`${tab?.value === 'undelivered' ? '' : 'hidden'}`}>
      {undeliveredEntries.filter(entry => entry.list.length).length === 0 ?
        <NotEntry /> :
        undeliveredEntries.map(entry => (
          <div key={entry.day} className="mt-12 first:mt-6">
            <div className="border-b dark:border-white/25 p-4 text-lg font-bold">{entry.day}曜日</div>
            <Detail entry={entry} now={now} />
          </div>
        ))
      }
    </div>
  );
}

function EntryList({ data }: { data: LibraryEntriesQuery | undefined }) {
  const now = Date.now();

  // 次の話があるものだけに絞る
  const hasNextPrograms = data?.viewer?.libraryEntries?.nodes?.filter(node => node?.nextProgram !== null);

  // 放映配信開始日時順に並び替え
  hasNextPrograms?.sort((a, b) => new Date(a?.nextProgram?.startedAt).getTime() - new Date(b?.nextProgram?.startedAt).getTime());

  // 配信済みまたは予定曜日ごとに格納する
  const entryEachDate: EntryEachDate[] = [
    { day: '配信済み', list: [] },
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
    const day = ['日','月','火','水','木','金','土'][startedAt.getDay()];
    const entry = isViewable ? entryEachDate.find(entry => entry.day === '配信済み') : entryEachDate.find(entry => entry.day === day);
    if (entry && program) {
      entry.list.push(program as LibraryEntry);
    }
  });

  return (
    <>
      <DeliveredList entryEachDate={entryEachDate} now={now} />
      <UnDeliveredList entryEachDate={entryEachDate} now={now} />
    </>
  );
}

export default function AnimeList() {
  const [statusState] = useRecoilState(statusStateAtom);
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: { states: [statusState] }
  });
  const STATE = Const.STATUSSTATE_LIST.find(state => state.id === statusState);

  return (
    <div className="relative">
      <header className="sticky top-0 dark:bg-black/60 backdrop-blur-md">
        <h1 className="flex items-center justify-center px-4 py-3 text-xl font-bold">
          <span className="mr-2 material-symbols-outlined material-symbols-outlined--fill">{STATE?.icon}</span>
          <span>{STATE?.label}</span>
        </h1>
        <div className="flex border-b dark:border-white/25">
          <SwitchTab value="delivered" label="配信済み" />
          <SwitchTab value="undelivered" label="未配信" />
        </div>
      </header>
      
      {loading && <div className="mt-12 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="p-4 dark:text-white/70">{error.message}</p>}
      
      {!(loading || error) && <EntryList data={data} />}
    </div>
  );
}