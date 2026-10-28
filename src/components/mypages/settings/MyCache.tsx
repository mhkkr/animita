import MyEpisodeRatings from '~/components/mypages/settings/cache/MyEpisodeRatings';
import MyMal from '~/components/mypages/settings/cache/MyMal';

export default function MyCache() {
  return (
    <section>
      <header className="px-4">
        <h1 className="text-lg font-bold">キャッシュ</h1>
        <p className="mt-1 text-sm">
          一度取得した情報を素早く提供するために下記をキャッシュします。
        </p>
      </header>
      
      <ul className="mt-4 grid gap-3 px-4">
        <li><MyMal /></li>
        <li><MyEpisodeRatings /></li>
      </ul>
    </section>
  );
}