import type { Metadata } from "next";

import LayoutContainer from '~/components/layouts/Container';
import { updates } from '~/data/updates';

const title = "更新履歴";

export const metadata: Metadata = {
  title,
};

export default function UpdatePage() {
  return (
    <LayoutContainer>
      <h1 className="mb-8 px-4 py-3 pt-1 sm:py-3 text-center text-lg font-bold border-b dark:border-stone-700">{title}</h1>
      
      {updates.map((update, updateIndex) => (
        <dl key={updateIndex} className="mt-4 px-4">
          <dt className="font-bold">
            {update.date}
            <span className="ml-3 text-sm font-normal dark:text-white/70">Ver {update.version}</span>
          </dt>
          <dd>
            <ul className="list-disc mt-1 ml-6">
              {update.comments.map((comment, commentIndex) => <li key={`${updateIndex}-${commentIndex}`}>{comment}</li>)}
            </ul>
          </dd>
        </dl>
      ))}
    </LayoutContainer>
  );
}