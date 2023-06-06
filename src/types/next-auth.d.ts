// https://github.com/SlashNephy/annict-tracker/blob/master/types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
  }
}