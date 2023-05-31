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
    { id: 'WATCHING', label: '見てる' },
    { id: 'WANNA_WATCH', label: '見たい' },
    { id: 'WATCHED', label: '見た' },
    { id: 'ON_HOLD', label: '一時中断' },
    { id: 'STOP_WATCHING', label: '視聴中止' }
  ];

  RATINGSTATE_LIST = [
    { id: 'BAD', label: '良くない', bgColor: 'bg-gray-500' },
    { id: 'AVERAGE', label: '普通', bgColor: 'bg-orange-500' },
    { id: 'GOOD', label: '良い', bgColor: 'bg-green-500' },
    { id: 'GREAT', label: 'とても良い', bgColor: 'bg-blue-500' },
  ];
}

export default new Const();