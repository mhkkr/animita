class Const {
  URL = 'http://watch.kakera.dev/';
  TITLE = 'みた！';
  DESCRIPTION = '「みた！」を使って Annict でアニメの視聴を管理しよう！';

  STATE_LIST = [
    { id: 'WATCHING', label: '見てる', icon: 'play_arrow' },
    { id: 'WANNA_WATCH', label: '見たい', icon: 'fiber_manual_record' },
    { id: 'WATCHED', label: '見た', icon: 'check' },
    { id: 'ON_HOLD', label: '一時中断', icon: 'pause' },
    { id: 'STOP_WATCHING', label: '視聴中止', icon: 'stop' }
  ];

  SEASON_LIST = [
    { ja: '春', en: 'SPRING' },
    { ja: '夏', en: 'SUMMER' },
    { ja: '秋', en: 'AUTUMN' },
    { ja: '冬', en: 'WINTER' },
  ];
}

export default new Const();