'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { LibraryEntries_WATCHING } from '~/features/apollo/gql/LibraryEntries_WATCHING';
import type { LibraryEntries_WatchingQuery } from '~/features/apollo/generated-types';
import BackButton from '~/components/buttons/BackButton';

export default function AnimeDetail({ annictId }: { annictId: string }) {
  const { data, loading, error } = useQuery<LibraryEntries_WatchingQuery>(LibraryEntries_WATCHING);
  if (loading) return <div>詳細取得中</div>;
  if (error) return <div>{error.message}</div>;
 
  const annictId_int = parseInt(annictId, 10);
  const anime = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work?.annictId === annictId_int);
  if (!anime) return <div>詳細取得できませんでした。</div>;

  const now = Date.now();
  const startedAt = new Date(anime?.nextProgram?.startedAt);
  const isViewable = now > startedAt.getTime();
  
  console.log(anime);
  
  return (
    <>
      <p><BackButton /></p>
      <figure className="bg-gray-300">
        <img src={anime?.work?.image?.facebookOgImageUrl || ''} alt="作品サムネイル" loading="lazy" onError={e => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';
        }} />
      </figure>
      <p className="mt-2 text-xs">{anime?.nextProgram?.channel.name}</p>
      <p className="mt-1 font-bold">{anime?.work.title}</p>
      <p className={`${isViewable ? 'text-lime-800 font-bold' : 'text-gray-700'}`}></p>
      <table>
        {isViewable && (
          <tr>
            <td>{startedAt.getFullYear()}/{startedAt.getMonth() + 1}/{startedAt.getDate()} {startedAt.getHours().toString().padStart(2, '0')}:{startedAt.getMinutes().toString().padStart(2, '0')}<span className="ml-1">({['日','月','火','水','木','金','土'][startedAt.getDay()]})</span></td>
            <td><span className="mr-1 cursor-pointer">📝</span>{anime?.nextProgram?.episode.numberText}</td>
            <td>{anime?.nextProgram?.episode.title}</td>
          </tr>
        )}
      </table>
      <p><BackButton /></p>
    </>
  );
}