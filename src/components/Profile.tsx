'use client';

import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { searchWorksGql } from '~/features/apollo/gql/searchWorksGql';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import type { SearchWorksQuery, Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import { useRecoilState } from 'recoil';
import { statusStateAtom } from '~/atoms/statusStateAtom';

import BackButton from '~/components/buttons/BackButton';
import { RingSpinner } from '~/components/spinners/Spinner';

import Episodes from '~/components/Episodes';

import Const from '~/constants';

const statusStateArray: string[] = [];
Const.STATE_LIST.map(state => statusStateArray.push(state.id));

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
          <span className={`material-symbols-outlined ${className}`}>{icon}</span>{label}
        </a>
      </li>
    );
  }
  return <></>;
}

function Channel({ work }: { work: Work }) {
  const { data, loading, error } = useQuery<LibraryEntriesQuery>(libraryEntriesGql, {
    variables: {
      states: statusStateArray,
      seasons: [`${work.seasonYear}-${work.seasonName?.toLowerCase()}`]
    }
  });
  const entry = data?.viewer?.libraryEntries?.nodes?.find(node => node?.work.annictId === work.annictId);
  
  if (loading) return <></>;
  if (error) { console.error(error); return <></>; }

  return (
    <RelatedLink
      icon="open_in_new"
      className="mr-1"
      test={work.title}
      href={`https://animestore.docomo.ne.jp/animestore/sch_pc?searchKey=${work.title}`}
      label={(work.programs?.nodes) ? entry?.nextProgram?.channel.name : ''}
    />
  )
}

export default function Profile({ work }: { work: Work }) {
  return (
    <>
      <figure className="bg-gray-300">
        <img src={work.image?.facebookOgImageUrl || ''} alt="作品サムネイル" loading="lazy" onError={e => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:13em;%22>No Image</text></svg>';
        }} />
      </figure>
      <ul className="flex gap-4 mt-4 px-4 text-xs">
        <Channel work={work} />
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
          icon="tag"
          className="mr-0.5"
          test={work.twitterHashtag}
          href={`https://twitter.com/hashtag/${work.twitterHashtag}?src=hashtag&f=live`}
          label={work.twitterHashtag}
        />
      </ul>
      <h1 className="mt-4 px-4 font-bold text-lg">{work.title}</h1>
      <ul className="flex gap-4 mt-2 px-4 text-xs dark:text-white/70">
        <li>視聴者数:{work.watchersCount}</li>
        <li>評価数:{work.reviewsCount}</li>
        <li>{work.seasonYear}年{Const.SEASON_LIST.find(season => season.en === work.seasonName)?.ja}</li>
      </ul>
    </>
  );
}