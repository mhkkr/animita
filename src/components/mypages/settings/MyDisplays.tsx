import MySelect from '~/components/mypages/settings/MySelect';

export default function MyDisplays() {
  return (
    <section>
      <header className="px-4">
        <h1 className="text-lg font-bold">表示</h1>
      </header>
      
      <ul className="mt-4 grid gap-2 px-4">
        <li><MySelect label="他のユーザーの記録" category="displays" id="peoples-records" /></li>
        <li><MySelect label="みんなの評価" category="displays" id="evaluation" /></li>
      </ul>
    </section>
  );
}