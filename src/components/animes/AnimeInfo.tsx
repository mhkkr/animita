'use client';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

import Stataus from '~/components/animes/AnimeStataus';
import Thumbnail from '~/components/animes/AnimeThumbnail';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUSSTATE_LIST.map(state => statusStateIdArray.push(state.id));

function RelatedLink({ icon, className, test, href, label }: {
  icon: string,
  className: string,
  test?: string | number | null,
  href?: string | null,
  label?: string | null
}) {
  if (test && href) {
    return (
      <li>
        <a className="flex items-center" href={href} target="_blank" rel="noopener noreferrer">
          <Icons id={icon} type="link" className={`text-[1.5em] ${className}`} />
          {label}
        </a>
      </li>
    );
  }
  return <></>;
}

function Channel({ work }: { work: Work }) {
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateIdArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);
  
  if (loading) return <></>;
  if (error) { console.error(error); return <></>; }

  return <>{entry?.nextProgram?.channel.name}</>;
}

export default function Info({ work }: { work: Work }) {
  return (
    <>
      <figure className="bg-gray-300">
        <Thumbnail work={work} className="mx-auto" />
      </figure>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 mt-4 px-4 text-xs">
        <RelatedLink
          icon="open_in_new"
          className="mr-1"
          test={work.annictId}
          href={`https://annict.com/works/${work.annictId}`}
          label="Annict"
        />
        <RelatedLink
          icon="open_in_new"
          className="mr-1"
          test={work.officialSiteUrl}
          href={work.officialSiteUrl}
          label="公式サイト"
        />
        <RelatedLink
          icon="hashtag"
          className="mr-0.5"
          test={work.twitterHashtag}
          href={`https://twitter.com/hashtag/${work.twitterHashtag}?src=hashtag&f=live`}
          label={work.twitterHashtag}
        />
      </ul>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 mt-4">
        <div className="flex-1">
          <h1 className="font-bold text-lg">{work.title}</h1>
          <ul className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-xs dark:text-white/70">
            <li>視聴者数：{work.watchersCount}</li>
            <li>評価数：{work.reviewsCount}</li>
            <li>{work.seasonYear}年{Const.SEASON_LIST.find(season => season.id === work.seasonName)?.label}</li>
            <li><Channel work={work} /></li>
          </ul>
        </div>
        <div className="flex-shrink-0 order-first sm:order-none">
          <Stataus work={work} />
        </div>
      </div>
    </>
  );
}