import type { Cast, Work } from '~/features/apollo/generated-types';

export default function Cast({ work }: { work: Work }) {
  const casts = (work.casts?.nodes ? Array.from(work.casts?.nodes) : []) as Cast[];
  return (
    <table className="w-full">
      <thead>
        <th className="py-1.5 px-2 pl-4 whitespace-nowrap w-0 text-left">声優</th>
        <th className="py-1.5 px-2 pr-4 text-left">キャラクター</th>
      </thead>
      <tbody>
      {casts.map(cast => (
        <tr key={cast.name} className="hover:bg-stone-500/30">
          <td className="py-1.5 px-2 pl-4 whitespace-nowrap w-0">{cast.name}</td>
          <td className="py-1.5 px-2 pr-4">{cast.character.name}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}