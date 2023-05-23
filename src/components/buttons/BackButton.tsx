'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button aria-label="戻る" type="button" onClick={() => router.back()}>
      戻る
    </button>
  );
}