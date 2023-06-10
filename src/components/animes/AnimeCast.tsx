import type { Cast, Work } from '~/features/apollo/generated-types';

export default function Cast({ work }: { work: Work }) {
  const casts = (work.casts?.nodes ? Array.from(work.casts?.nodes) : []) as Cast[];
  return (
    <>
      <h2 className="px-4 pb-2 mb-2 font-bold border-b dark:border-white/25">キャスト</h2>
      <table className="w-full">
        <thead>
          <th className="p-2 pl-4 whitespace-nowrap w-0">声優</th>
          <th className="p-2 pr-4">キャラクター</th>
        </thead>
        <tbody>
        {casts.map(cast => (
          <tr key={cast.name}>
            <td className="p-2 pl-4 whitespace-nowrap w-0">{cast.name}</td>
            <td className="p-2 pr-4">{cast.character.name}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}