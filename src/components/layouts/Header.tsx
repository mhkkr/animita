'use client';

import Link from 'next/link';
import Image from 'next/image';

import Nav from '~/components/Nav';
import User from '~/components/User';

import Const from '~/constants';

export default function Header({ className }: { className: string }) {
  return (
    <header className={`${className} relative`}>
      <div className="sticky top-0 flex flex-col h-screen overflow-x-hidden overflow-y-auto">
        <h1 className="my-4">
          <Link className="table mx-auto bg-white rounded-full w-24 h-24" href="/">
            <Image
              className="object-cover w-24 h-24"
              src="/mitabit-home.png"
              width={336 * .3}
              height={420 * .3}
              alt={Const.TITLE}
            />
          </Link>
        </h1>
        <Nav />
        <div className="mt-auto">
          <User />
        </div>
      </div>
    </header>
  );
}