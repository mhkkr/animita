'use client';

import { useRouter } from 'next/navigation';

import Icons from '~/components/icons/Icons';

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="flex items-center px-4 py-3" aria-label="戻る" type="button">
      <Icons id="arrow_back" type="navigation" className="text-[1.5em]" />
      戻る
    </button>
  );
}