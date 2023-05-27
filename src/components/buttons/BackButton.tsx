'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="flex items-center px-4 py-3" aria-label="戻る" type="button">
      <span className="material-symbols-outlined">arrow_back_ios</span>
      戻る
    </button>
  );
}