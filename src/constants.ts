class Const {
  URL = 'https://animita.vercel.app/';
  TITLE = 'アニみた';
  DESCRIPTION = '「アニみた」は、Annict が提供する API を利用したユーザークライアントです。すぐ見れるアニメの把握と感想を書きやすくして、ちょっとだけアニメライフの充実に貢献する！';

  EPISODE_TITLE_UNDEFINED = '（未登録）';

  MY_PAGES = [
    { id: 'profile', path: '/', title: 'ユーザー', icon: 'person' },
    { id: 'records', path: '/records', title: '履歴', icon: 'history' },
    { id: 'setting', path: '/setting', title: '設定', icon: 'settings' },
  ];
  MY_RECORDS_LIMIT = 50;

  STORAGE_MAL = 'mal';
  STORAGE_MUTED_USERS = 'mutedUsers';
  STORAGE_SETTINGS = 'settings';

  SEASON_LIST = [
    { id: 'SPRING', label: '春' },
    { id: 'SUMMER', label: '夏' },
    { id: 'AUTUMN', label: '秋' },
    { id: 'WINTER', label: '冬' },
  ];

  STATUS_STATE_LIST = [
    { id: 'WANNA_WATCH', label: '見たい', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { id: 'WATCHING', label: '見てる', color: 'text-sky-500', bgColor: 'bg-sky-500' },
    { id: 'WATCHED', label: '見た', color: 'text-green-500', bgColor: 'bg-green-500' },
    { id: 'ON_HOLD', label: '一時中断', color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 'STOP_WATCHING', label: '視聴中止', color: 'text-gray-500', bgColor: 'bg-gray-500' }
  ];

  RATING_STATE_LIST = [
    { id: 'BAD', label: '良くない', bgColor: 'bg-gray-500', color: 'text-gray-500' },
    { id: 'AVERAGE', label: '普通', bgColor: 'bg-orange-500', color: 'text-orange-500' },
    { id: 'GOOD', label: '良い', bgColor: 'bg-green-500', color: 'text-green-500' },
    { id: 'GREAT', label: 'とても良い', bgColor: 'bg-blue-500', color: 'text-blue-500' },
  ];

  SPECIAL_ANIME_LIST = [
    { id: 'this', label: '今期のアニメ' },
    { id: 'next', label: '来期のアニメ' },
    { id: 'prev', label: '前期のアニメ' },
    { id: 'popular', label: '人気アニメ' },
    { id: 'new', label: '新規登録アニメ' },
  ];
}

export default new Const();