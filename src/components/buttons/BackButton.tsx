'use client';

import { useRouter } from 'next/navigation';

import NavigationIcon from '~/components/icons/NavigationIcon';

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="flex items-center px-4 py-3" aria-label="戻る" type="button">
      <NavigationIcon id="arrow_back" className="text-[1.5em]" />
      戻る
    </button>
  );
}