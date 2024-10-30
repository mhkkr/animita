'use client';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { Cast, Work, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

import Const from '~/constants';

const statusStateIdArray: string[] = [];
Const.STATUSSTATE_LIST.map(state => statusStateIdArray.push(state.id));

export function Link({ work }: { work: Work }) {
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

  return (
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
        test={work.malAnimeId}
        href={`https://myanimelist.net/anime/${work.malAnimeId}`}
        label="MyAnimeList"
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
  );
}

export function Channel({ work }: { work: Work }) {
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

export function Staff({ work }: { work: Work }) {
  const gensakuStaffs = work.staffs?.nodes ? work.staffs.nodes.filter(staff => staff?.roleText === '原作') : [];
  const kantokuStaffs = work.staffs?.nodes ? work.staffs.nodes.filter(staff => staff?.roleText === '監督') : [];
  const seisakuStaffs = work.staffs?.nodes ? work.staffs.nodes.filter(staff => staff?.roleText === 'アニメーション制作') : [];
  const staffs = [...gensakuStaffs, ...kantokuStaffs, ...seisakuStaffs];

  const sumRoleStaffs: { displayRoleText: string, roleText: string, name: string }[] = [
    { displayRoleText: '原作', roleText: '原作', name: '' },
    { displayRoleText: '監督', roleText: '監督', name: '' },
    { displayRoleText: '制作', roleText: 'アニメーション制作', name: '' }
  ];
  staffs.forEach(staff => {
    const role = sumRoleStaffs.find(sum => sum.roleText === staff?.roleText);
    if (role && staff?.name) {
      if (role.name) {
        role.name = role.name + '／' + staff.name;
      } else {
        role.name = staff.name;
      }
    }
  });

  return (
    <ul className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-xs dark:text-white/70">
      {sumRoleStaffs.map(sum => sum.name && <li key={sum.displayRoleText + '-' + sum.name}>{sum.displayRoleText}：{sum.name}</li>)}
    </ul>
  );
}

export function Cast({ work }: { work: Work }) {
  const casts = (work.casts?.nodes ? Array.from(work.casts?.nodes) : []) as Cast[];
  return (
    <table className="w-full">
      <tbody>
        {casts.map(cast => (
          <tr key={cast.character.name + '-' + cast.person.annictId} className="hover:bg-stone-500/30">
            <td className="align-top py-1.5 px-2 pl-4 text-right">{cast.character.name}</td>
            <td className="align-top py-1.5 px-2 pr-4">
              <div className="flex flex-wrap items-center gap-1">
                <span>{cast.person.name}</span>
                {cast.person.nameKana && <span className="inline-block text-sm">（{cast.person.nameKana}）</span>}
                <a href={`https://annict.com/people/${cast.person.annictId}`} target="_blank" rel="noopener noreferrer">
                  <Icons id="open_in_new" type="link" />
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}