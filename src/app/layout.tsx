import '~/app/globals.scss';

import ApolloProviderWrapper from '~/features/apollo/components/Provider';
import SessionProviderWrapper from '~/features/oauth/components/Provider';
import LoginController from '~/features/oauth/components/Controller';
import RecoilRoot from '~/features/recoli/components/Root';

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata = {
  title: 'みた！',
  description: 'あの作品を見た観た履歴。いまのところ Annict だけ。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${roboto.variable}`}>
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