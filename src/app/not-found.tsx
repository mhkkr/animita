import type { Metadata } from "next";
import Link from "next/link";

import LayoutContainer from "~/components/layouts/Container";
import Icons from "~/components/icons/Icons";

export const metadata: Metadata = {
  title: "ページが見つかりません",
};

export default function NotFound() {
  return (
    <LayoutContainer>
      <div className="px-4 pt-12 text-center dark:text-white/70">
        <Icons id="unknow" type="notification" className="table mx-auto mb-4 text-2xl" />
        <h1 className="text-lg font-bold">ページが見つかりません</h1>
        <p className="mt-2">アドレスが間違っているか、ページが移動した可能性があります。</p>
        <p className="mt-6">
          <Link href="/" className="underline">視聴中へ戻る</Link>
        </p>
      </div>
    </LayoutContainer>
  );
}
