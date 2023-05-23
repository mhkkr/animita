'use client';

import { signOut } from 'next-auth/react';

export default function Logout() {
  return (
    <div>
      <button onClick={() => signOut()} className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75" type="button">ログアウトする</button>
    </div>
  );
}