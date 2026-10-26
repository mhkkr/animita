import type { Metadata } from 'next';

import MyRecords from '~/components/mypages/MyRecords';

import Const from '~/constants';

const id = 'records';

export const metadata: Metadata = {
  title: Const.MY_PAGES.find(page => page.id === id)?.title,
};

export default function MyPage() {
  return <MyRecords />;
}
