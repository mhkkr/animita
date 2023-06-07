import '~/app/globals.scss';

import ApolloProviderWrapper from '~/features/apollo/components/Provider';
import SessionProviderWrapper from '~/features/oauth/components/Provider';
import LoginController from '~/features/oauth/components/Controller';
import RecoilRoot from '~/features/recoli/components/Root';

import Analytics from '~/components/Analytics';

import Const from '~/constants';

export const metadata = {
  title: {
    default: Const.TITLE,
    template: `%s - ${Const.TITLE}`,
  },
  description: Const.DESCRIPTION,
  openGraph: {
    title: Const.TITLE,
    description: Const.DESCRIPTION,
    url: Const.URL,
    siteName: Const.TITLE,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: Const.TITLE,
    description: Const.DESCRIPTION,
    site: '@サイト用アカウントのTwitterID',
    creator: '@kakera_dev',
  },  
  verification: {
    google: 'サーチコンソールのやつ',
  },
  alternates: {
    canonical: Const.URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <meta name="theme-color" content="#334155" />
      </head>
      <body>
        <Analytics />
        <ApolloProviderWrapper>
          <SessionProviderWrapper>
            <LoginController>
              <RecoilRoot>
                {children}
              </RecoilRoot>
            </LoginController>
          </SessionProviderWrapper>
        </ApolloProviderWrapper>
      </body>
    </html>
  )
}