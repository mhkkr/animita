import Const from "~/constants";

import Icons from "~/components/icons/Icons";

export default function MyHeader({ pageId }: { pageId: string }) {
  const page = Const.MY_PAGES.find((page) => page.id === pageId);
  const title = page?.title ?? "マイページ";

  return (
    <header className="border-b dark:border-stone-700">
      <h1 className="flex items-center justify-center p-4 text-xl font-bold">
        {page?.icon && <Icons id={page.icon} type="navigation" className="mr-2 text-[1.5em]" />}
        <span>{title}</span>
      </h1>
    </header>
  );
}
