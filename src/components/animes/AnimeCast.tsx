import type { Cast, Work } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

export default function Cast({ work }: { work: Work }) {
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