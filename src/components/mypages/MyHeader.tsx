import Const from "~/constants";

export default function MyHeader({ pageId }: { pageId: string }) {
  const title = Const.MY_PAGES.find((page) => page.id === pageId)?.title ?? "マイページ";

  return (
    <header className="z-10 sticky top-0 dark:bg-black/60 backdrop-blur-md border-b dark:border-stone-700">
      <h1 className="flex items-center justify-center p-4 text-xl font-bold">
        {title}
      </h1>
    </header>
  );
}
