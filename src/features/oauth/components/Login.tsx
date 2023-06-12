'use client';

import Image from 'next/image';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

const Loading = () => {
  return (
    <>
      <div className="text-center text-5xl text-pink-600"><RingSpinner /></div>
      <p className="mt-6 text-center text-lg font-bold text-gray-700 dark:text-white/70">処理中…</p>
    </>
  );
};

const Main = () => {
  const [processing, setProcessing] = useState(false);
  
  const handleSingIn = async () => {
    setProcessing(true);

    try {
      await signIn('annict', { callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL });
    } catch (e) {
      if (e instanceof Error) {
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <p className="text-gray-700 dark:text-white">
        「{Const.TITLE}」は、Annict が提供する API を使ったユーザークライアントです。
      </p>
      <p className="mt-4 text-gray-700 dark:text-white">
        主に配信サイト勢向けにすぐ見れるアニメと次の予定を分かりやすく把握し、ちょっとだけアニメライフの充実に貢献できればと思い開発しました。<br />
        PWA に対応しており、スマホアプリのように使うことができます！
      </p>
      <div className="mt-8">
        <p className="text-gray-500 dark:text-white">まずは Annict と連携してみましょう！</p>
        <button
          className={`mt-2 flex items-center justify-center w-full px-10 py-4 font-medium text-center text-white transition duration-500 ease-in-out transform bg-pink-600 rounded-xl hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${processing ? 'cursor-not-allowed grayscale' : ''}`}
          type="button"
          onClick={handleSingIn}
          disabled={processing}
        >{processing ? <span className="mr-2 text-white"><RingSpinner /></span> : ''}Annict と連携する</button>
      </div>
      <ul className="mt-8 text-xs text-gray-500 dark:text-white/70">
        <li className="mt-1 pl-[1em] indent-[-1em]">※開発中の為、想定外の動作があるかもしれません。</li>
        <li className="mt-1 pl-[1em] indent-[-1em]">※Google Analytics を使用しています（<a className="text-sky-700 hover:underline" href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer">規約</a>）。</li>
        <li className="mt-1 pl-[1em] indent-[-1em]">※ソースコードは <a className="text-sky-700 hover:underline" href="https://github.com/mhkkr/animita" target="_blank" rel="noopener noreferrer">GitHub</a> で公開しています。</li>
      </ul>
    </>
  );
};

export default function Login({ status }: { status: string }) {
  return (
    <>
      <main className="min-h-screen mx-auto max-w-md flex flex-col justify-center p-4">
        <div className="w-full my-12 bg-white dark:bg-black rounded-lg shadow-lg">
          <h1 className="mx-auto -mt-12 w-24 h-24 p-4 bg-slate-400 dark:bg-slate-700 rounded-full overflow-hidden">
            <Image
              className="object-contain w-full h-full"
              src="/logo.svg"
              width={600}
              height={500}
              alt={Const.TITLE}
            />
          </h1>
          <div className="px-6 mt-8 mb-10">
            {status === 'loading' ? <Loading /> : <Main />}
          </div>
        </div>
      </main>
      <div className="fixed inset-0 -z-10 bg-slate-400 dark:bg-slate-700"></div>
    </>
  );
}