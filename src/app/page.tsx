'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import client from '../../apollo-client';

export default function Home() {
  const [watchAnimeList, setWatchAnimeList] = useState<any[]>([]);

  useEffect(()=>{
    (async()=>{
      const { data } = await client.query({
        query: gql`
          query {
            viewer {
              libraryEntries(
                states: [WATCHING]
              ) {
                nodes {
                  work {
                    annictId
                    title
                    image {
                      facebookOgImageUrl
                      copyright
                    }
                  }
                  nextProgram {
                    channel {
                      name
                    }
                    startedAt
                    episode {
                      number
                      numberText
                      title
                    }
                  }
                  note
                }
              }
            }
          }
        `,
      });

      const animeList = data.viewer.libraryEntries.nodes.filter(node => node.nextProgram !== null);
      console.log(animeList);
      animeList.sort((a, b) => new Date(a.nextProgram.startedAt).getTime() - new Date(b.nextProgram.startedAt).getTime());
      setWatchAnimeList(animeList);
    })();
  },[]);

  const now = Date.now();

  return (
    <main className="max-w-lg mx-auto box-content p-4">
      <div>
        <h1 className="text-center mb-4 text-xl font-bold">見てる</h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {watchAnimeList.map((anime) => {
            const startedAt = new Date(anime.nextProgram.startedAt);
            return (
              <div key={anime.work.annictId}>
                <Link href="#">
                  <figure className="relative bg-gray-300 before:content-[''] before:block before:pt-[52.5%]">
                    <img className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain h-full w-full" src={anime.work.image.facebookOgImageUrl} alt="作品サムネイル" loading="lazy"  onError={e => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:20px;%22>No Image</text></svg>';
                    }} />
                  </figure>
                  <p className={`flex gap-2 p-2 rounded-b-sm text-xs ${now > startedAt.getTime() ? 'bg-lime-800 text-white' : 'bg-gray-300'}`}>
                    <span className="break-all">{startedAt.getFullYear()}/{startedAt.getMonth() + 1}/{startedAt.getDate()} {startedAt.getHours().toString().padStart(2, '0')}:{startedAt.getMinutes().toString().padStart(2, '0')}<span className="ml-1">({['日','月','火','水','木','金','土'][startedAt.getDay()]})</span></span>
                    <span>{anime.nextProgram.channel.name}</span>
                  </p>
                </Link>
                <p className="mt-1 text-sm font-bold">{anime.work.title}</p>
                <p className="mt-1 text-sm">{anime.nextProgram.episode.numberText}<span className="ml-1">{anime.nextProgram.episode.title}</span></p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}