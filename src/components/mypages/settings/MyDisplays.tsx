import MySelect from '~/components/mypages/settings/MySelect';

export default function MyDisplays() {
  return (
    <section>
      <header className="px-4">
        <h1 className="text-lg font-bold">表示</h1>
      </header>
      
      <div className="mt-4 grid gap-4 px-4">
        <section>
          <h2 className="mb-2 font-bold">エピソード</h2>
          <ul className="grid gap-2">
            <li><MySelect label="他のユーザーの感想" category="displays" id="peoples-records" /></li>
            <li><MySelect label="みんなの評価" category="displays" id="evaluation" /></li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-bold">記録</h2>
          <ul className="grid gap-2">
            <li><MySelect label="他のユーザーの感想" category="displays" id="work-peoples-records" /></li>
            <li><MySelect label="みんなの評価" category="displays" id="work-evaluation" /></li>
          </ul>
        </section>
      </div>
    </section>
  );
}