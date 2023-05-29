class Const {
  URL = 'http://watch.kakera.dev/';
  TITLE = 'みた！';
  DESCRIPTION = '「みた！」を使って Annict でアニメの視聴を管理しよう！';

  SEASON_LIST = [
    { id: 'SPRING', label: '春' },
    { id: 'SUMMER', label: '夏' },
    { id: 'AUTUMN', label: '秋' },
    { id: 'WINTER', label: '冬' },
  ];

  STATUSSTATE_LIST = [
    { id: 'WATCHING', label: '見てる', icon: 'play_arrow' },
    { id: 'WANNA_WATCH', label: '見たい', icon: 'fiber_manual_record' },
    { id: 'WATCHED', label: '見た', icon: 'check' },
    { id: 'ON_HOLD', label: '一時中断', icon: 'pause' },
    { id: 'STOP_WATCHING', label: '視聴中止', icon: 'stop' }
  ];

  RATINGSTATE_LIST = [
    { id: 'BAD', label: '良くない', icon: 'thumb_down', bgColor: 'bg-gray-500' },
    { id: 'AVERAGE', label: '普通', icon: 'sentiment_satisfied', bgColor: 'bg-orange-500' },
    { id: 'GOOD', label: '良い', icon: 'thumb_up', bgColor: 'bg-green-500' },
    { id: 'GREAT', label: 'とても良い', icon: 'favorite', bgColor: 'bg-blue-500' },
  ];
}

export default new Const();