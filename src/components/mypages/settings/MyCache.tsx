import MyMal from '~/components/mypages/settings/cache/MyMal';

export default function MyCache() {
  return (
    <section>
      <header className="px-4">
        <h1 className="text-lg font-bold">キャッシュ</h1>
      </header>
      
      <ul className="mt-4 grid gap-2 px-4">
        <li><MyMal /></li>
      </ul>
    </section>
  );
}