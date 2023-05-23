'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { LibraryEntries_WATCHING } from '~/features/apollo/gql/LibraryEntries_WATCHING';
import type { LibraryEntries_WatchingQuery, LibraryEntry } from '~/features/apollo/generated-types';

export default function WatchAnimeList() {
  const { data, loading, error } = useQuery<LibraryEntries_WatchingQuery>(LibraryEntries_WATCHING);
  if (loading) return <div>リスト取得中</div>;
  if (error) return <div>{error.message}</div>;

  const now = Date.now();

  // 次回があるものだけに絞る
  const watchingAnimeHasNextProgram = data?.viewer?.libraryEntries?.nodes?.filter(node => node?.nextProgram !== null);

  // 放映配信開始日時順に並び替え
  watchingAnimeHasNextProgram?.sort((a, b) => new Date(a?.nextProgram?.startedAt).getTime() - new Date(b?.nextProgram?.startedAt).getTime());

  // 視聴可能または予定曜日ごとに格納する
  const animeDayEntries: Array<{ day: string, list: Array<LibraryEntry | any> }> = [
    { day: '視聴可能', list: [] },
    { day: '日', list: [] },
    { day: '月', list: [] },
    { day: '火', list: [] },
    { day: '水', list: [] },
    { day: '木', list: [] },
    { day: '金', list: [] },
    { day: '土', list: [] }
  ];
  watchingAnimeHasNextProgram?.forEach(anime => {
    const startedAt = new Date(anime?.nextProgram?.startedAt);
    const isViewable = now > startedAt.getTime();
    const day = ['日','月','火','水','木','金','土'][startedAt.getDay()];
    const entry = isViewable ? animeDayEntries.find(anime => anime.day === '視聴可能') : animeDayEntries.find(anime => anime.day === day);
    if (entry && anime) {
      entry.list.push(anime);
    }
  });

  // 曜日で並び替え
  const animeList = animeDayEntries.slice(0, 1)
                    // 今日の曜日から最後まで取得
                    .concat(animeDayEntries.slice(new Date().getDay() + 1))
                    // 視聴可能の次から今日の曜日の前まで取得
                    .concat(animeDayEntries.slice(1, new Date().getDay() + 1));

  if (!animeList) return <div>リスト取得できませんでした。</div>;

  // console.log(watchingAnimeHasNextProgram);
  // console.log(animeList);

  return (
    <div>
      <h1 className="text-center my-4 text-xl font-bold">見てる</h1>
      <div>
        {animeList.filter(entry => entry.list.length).map((entry, i) => {
          return (
            <div key={entry.day} className="mb-12">
              <div className={`px-4 py-2 font-bold ${entry.day === '視聴可能' ? 'bg-lime-800 text-white' : 'bg-gray-300'}`}>{entry.day}{entry.day !== '視聴可能' && '曜日'}</div>
              <ul>
                {entry.list?.map((anime: LibraryEntry, i) => {
                  const startedAt = new Date(anime?.nextProgram?.startedAt);
                  const isViewable = now > startedAt.getTime();
                  return (
                    <li key={anime?.work.annictId} className={`flex gap-3 px-3 py-4 border-t-gray-300 border-t first:border-t-0 ${isViewable ? 'bg-lime-100/50' : ''}`}>
                      <div className="flex-shrink-0 w-28">
                        <Link href={`/anime/${anime?.work.annictId}`}>
                          <figure className="bg-gray-300">
                            <img className="mx-auto object-contain max-h-28 max-w-28" src={anime?.work?.image?.facebookOgImageUrl ?? ''} alt="作品サムネイル" loading="lazy" onError={e => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';
                            }} />
                          </figure>
                        </Link>
                        <p className="mt-2 text-center text-xs">{anime?.nextProgram?.channel.name}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${isViewable ? 'text-lime-800 font-bold' : 'text-gray-700'}`}>{startedAt.getFullYear()}/{startedAt.getMonth() + 1}/{startedAt.getDate()} {startedAt.getHours().toString().padStart(2, '0')}:{startedAt.getMinutes().toString().padStart(2, '0')}<span className="ml-1">({['日','月','火','水','木','金','土'][startedAt.getDay()]})</span></p>
                        <p className="mt-1 text-sm font-bold"><Link href={`/anime/${anime?.work.annictId}`}>{anime?.work.title}</Link></p>
                        <div className="mt-1 text-sm">
                          <span className="flex gap-1">
                            <span className="whitespace-nowrap">{isViewable && <span className="mr-1 cursor-pointer">📝</span>}{anime?.nextProgram?.episode.numberText}</span>
                            <span>{anime?.nextProgram?.episode.title}</span>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}