import NextAuth from 'next-auth';

const handler = NextAuth(
  {
    providers: [{
      id: 'annict',
      name: 'Annict',
      type: 'oauth',
      clientId: process.env.ANNICT_CLIENT_ID,
      clientSecret: process.env.ANNICT_CLIENT_SECRET,
      authorization: {
        url: 'https://api.annict.com/oauth/authorize',
        params: {
          response_type: 'code',
          scope: 'read write'
        }
      },
      token: 'https://api.annict.com/oauth/token',
      userinfo: 'https://api.annict.com/v1/me',
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url
        }
      }
    }],
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token, user }) {
        session.accessToken = token.accessToken;
        // 取得できない…。
        // if (session?.user) {
        //   session.user.id = user.id;
        // }
        return session;
      }
    }
  }
);

export { handler as GET, handler as POST }