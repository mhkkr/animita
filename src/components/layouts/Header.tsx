'use client';

import Link from 'next/link';
import Image from 'next/image';

import Nav from '~/components/layouts/Nav';
import User from '~/components/layouts/User';

import Const from '~/constants';

export default function Header({ className }: { className: string }) {
  return (
    <header className={`${className} relative z-40`}>
      <div className="sm:sticky sm:top-0 flex items-center sm:items-stretch sm:flex-col p-4 sm:p-0 sm:w-48 sm:h-screen sm:overflow-x-hidden sm:overflow-y-auto border-b dark:border-stone-700 mb-2 sm:mb-0 sm:border-b-0">
        <h1 className="sm:my-8 w-8 sm:w-auto">
          <Link className="table mx-auto" href="/">
            <Image
              src="/logo.svg"
              width={600 * .1}
              height={500 * .1}
              alt={Const.TITLE}
              priority
              loading="eager"
            />
          </Link>
        </h1>
        <Nav />
        <div className="sm:mt-auto ml-auto sm:ml-0">
          <User />
        </div>
      </div>
    </header>
  );
}