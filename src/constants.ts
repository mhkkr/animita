class Const {
  URL = 'https://animita.vercel.app/';
  TITLE = 'アニみた';
  DESCRIPTION = '「アニみた」は、Annict が提供する API を利用したユーザークライアントです。すぐ見れるアニメの把握と感想を書きやすくして、ちょっとだけアニメライフの充実に貢献する！';

  EPISODE_TITLE_UNDEFINED = '（未登録）';

  MY_PAGES = [
    { id: 'mypage', path: '/', title: 'マイページ', icon: 'person' },
    { id: 'profile', path: '/', title: 'ユーザー', icon: 'person' },
    { id: 'records', path: '/records', title: '履歴', icon: 'history' },
    { id: 'setting', path: '/setting', title: '設定', icon: 'settings' },
  ];
  PAGE_SIZE = 50;

  STORAGE_MAL = 'animita-mal';
  STORAGE_MUTED_USERS = 'animita-mutedUsers';
  STORAGE_SETTINGS = 'animita-settings';
  STORAGE_EPISODE_RATINGS = 'animita-episodeRatings';

  SEASON_LIST = [
    { id: 'SPRING', label: '春' },
    { id: 'SUMMER', label: '夏' },
    { id: 'AUTUMN', label: '秋' },
    { id: 'WINTER', label: '冬' },
  ];

  MEDIA_FILTERS = [
    { id: 'TV', label: 'TV' },
    { id: 'MOVIE', label: '映画' },
    { id: 'OVA', label: 'OVA' },
    { id: 'WEB', label: 'Web' },
    { id: 'OTHER', label: 'その他' },
  ] as const;

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
}

const constants = new Const();

export default constants;