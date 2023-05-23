import '~/app/globals.scss';
import { Inter } from 'next/font/google';

import ApolloProviderWrapper from '~/features/apollo/components/Provider';
import SessionProviderWrapper from '~/features/oauth/components/Provider';
import LoginController from '~/features/oauth/components/Controller';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <ApolloProviderWrapper>
          <SessionProviderWrapper>
            <LoginController>
              {children}
            </LoginController>
          </SessionProviderWrapper>
        </ApolloProviderWrapper>
      </body>
    </html>
  )
}