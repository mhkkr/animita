class Const {
  URL = 'https://animita.vercel.app/';
  TITLE = 'アニみた';
  DESCRIPTION = '「アニみた」は、Annict が提供する API を利用したユーザークライアントです。すぐ見れるアニメの把握と感想を書きやすくして、ちょっとだけアニメライフの充実に貢献する！';

  EPISODE_TITLE_UNDEFINED = '（未登録）';

  MY_PAGES = [
    { id: 'profile', path: '/', title: 'ユーザー' },
    { id: 'records', path: '/records', title: '履歴' },
    { id: 'setting', path: '/setting', title: '設定' },
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
    { id: 'WATCHING', label: '見てる' },
    { id: 'WANNA_WATCH', label: '見たい' },
    { id: 'WATCHED', label: '見た' },
    { id: 'ON_HOLD', label: '一時中断' },
    { id: 'STOP_WATCHING', label: '視聴中止' }
  ];

  RATING_STATE_LIST = [
    { id: 'BAD', label: '良くない', bgColor: 'bg-gray-500' },
    { id: 'AVERAGE', label: '普通', bgColor: 'bg-orange-500' },
    { id: 'GOOD', label: '良い', bgColor: 'bg-green-500' },
    { id: 'GREAT', label: 'とても良い', bgColor: 'bg-blue-500' },
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