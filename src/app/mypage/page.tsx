import type { Metadata } from "next";

import MyProfile from '~/components/mypages/MyProfile';

import Const from '~/constants';

const id = 'profile';

export const metadata: Metadata = {
  title: Const.MY_PAGES.find(page => page.id === id)?.title,
};

export default function MyPage() {
  return <MyProfile />;
}
