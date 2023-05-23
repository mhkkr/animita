'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { RingSpinner } from '~/components/spinners/Spinner';

import Mitabit from 'public/mitabit.svg';
import Image from 'next/image';

const Loading = () => {
  return (
    <>
      <div className="text-center text-5xl text-pink-600"><RingSpinner /></div>
      <p className="mt-6 text-center text-lg font-bold text-gray-700">処理中…</p>
    </>
  );
};

const Main = () => {
  const [processing, setProcessing] = useState(false);
  
  const handleSingIn = async () => {
    setProcessing(true);

    try {
      await signIn('annict', { callbackUrl: process.env.NEXT_PUBLIC_URL });
    } catch (e) {
      if (e instanceof Error) {
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <div className="inline-flex items-center w-full">
        <h2 className="text-2xl font-bold text-gray-700 leading-6 lg:text-5xl">ようこそ！</h2>
      </div>
      <p className="mt-4 text-base text-gray-700">「みた！」は、Annict が提供する API を利用したユーザークライアントです。</p>
      <p className="mt-6 text-base text-gray-500">まずは Annict と連携してみましょう！</p>
      <div className="mt-2">
        <button
          className={`flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-pink-600 rounded-xl hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${processing ? 'cursor-not-allowed grayscale' : ''}`}
          type="button"
          onClick={handleSingIn}
          disabled={processing}
        >{processing ? <span className="mr-2 text-white"><RingSpinner /></span> : ''}Annict と連携する</button>
      </div>
      <ul className="mt-12 text-xs text-gray-500">
        <li className="mt-1 pl-[1em] indent-[-1em]">※開発中の為、想定外の動作があるかもしれません。</li>
        <li className="mt-1 pl-[1em] indent-[-1em]">※Google Analytics を使用しています（<a className="text-sky-700 hover:underline" href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer">規約</a>）。</li>
        <li className="mt-1 pl-[1em] indent-[-1em]">※ソースコードは <a className="text-sky-700 hover:underline" href="https://github.com/mhkkr/watch.kakera.dev" target="_blank" rel="noopener noreferrer">GitHub</a> で公開しています。</li>
      </ul>
    </>
  );
};

export default function Login({ status }: { status: string }) {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-white rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
            <div className="w-full p-6">
              {status === 'loading' ? <Loading /> : <Main />}
            </div>
            <div className="order-first hidden w-full border-r border-gray-200 lg:block">
              <Image
                className="object-cover h-full rounded-l-lg"
                src="/mitabit-home.png?1"
                width={336}
                height={420}
                alt="Picture of the author"
              />
              {/* <Mitabit /> */}
            </div>
          </div>
        </div>
      </main>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-400 to-transparent after:content-[''] after:absolute after:inset-0 after:bg-[url('/bg.svg')] after:bg-[length:80px] after:opacity-10"></div>
    </>
  );
}