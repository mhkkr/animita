'use client';

import { useSession } from 'next-auth/react';

import Login from '~/features/oauth/components/Login';

export default function LoginController({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession();

  if (session) {
    return <>{children}</>;
  } else {
    return <Login status={status} />;
  }
}