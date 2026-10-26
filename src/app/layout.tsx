import type { Metadata } from "next";

import "~/app/globals.css";

import { getServerSession } from "next-auth";

import ApolloProviderWrapper from "~/features/apollo/components/Provider";
import SessionProviderWrapper from "~/features/oauth/components/Provider";
import LoginController from "~/features/oauth/components/Controller";
import { authOptions } from "~/features/oauth/auth";

import Analytics from "~/components/Analytics";
import NavigationProgress from "~/components/NavigationProgress";
import StorageMigration from "~/components/StorageMigration";

import Const from "~/constants";

export const metadata: Metadata = {
  title: {
    default: Const.TITLE,
    template: `%s｜${Const.TITLE}`,
  },
  description: Const.DESCRIPTION,
  openGraph: {
    title: Const.TITLE,
    description: Const.DESCRIPTION,
    url: Const.URL,
    siteName: Const.TITLE,
    images: {
      url: Const.URL + "og-image.png",
      width: 1200,
      height: 630,
    },
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: Const.TITLE,
    description: Const.DESCRIPTION,
    images: {
      url: Const.URL + "og-image.png",
      width: 1200,
      height: 630,
    },
    creator: "@kakera_dev",
  },
  verification: {
    google: "vjqnqyyQHxEhW2NoR4bqhDWGX8mZLNz046_yoyBzHG8",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja" className="scrollbar-gutter-stable">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <meta name="theme-color" content="#334155" />
      </head>
      <body>
        <StorageMigration />
        <NavigationProgress />
        <Analytics />
        <ApolloProviderWrapper>
          <SessionProviderWrapper session={session}>
            <LoginController>
              {children}
            </LoginController>
          </SessionProviderWrapper>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
