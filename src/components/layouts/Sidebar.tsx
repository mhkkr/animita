import Logout from '~/features/oauth/components/Logout';

function Main() {
  return (
    <div className="bg-gray-300 relative w-72">
      <div className="sticky top-0">
        <nav>
          <ul>
            <li><button type="button">見てる</button></li>
            <li><button type="button">見たい</button></li>
            <li><button type="button">見た</button></li>
            <li><button type="button">中断</button></li>
            <li><button type="button">中止</button></li>
          </ul>
        </nav>
        <div><input type="search" name="" id="" value="探そう" /></div>
        <div>
          <button type="button">ユーザー</button>
          <Logout />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      <Main />
    </>
  );
}