export const STREAM_SEPARATOR = " / ";

const STREAM_GROUPS = new Set(["動画サービス", "ABEMA"]);

type StreamProgram = {
  channel?: {
    name?: string | null;
    channelGroup?: { name?: string | null } | null;
  } | null;
} | null;

/** 動画配信サービスと ABEMA のチャンネル名。地上波の局は含めない */
export function streamServiceNames(
  programs?: { nodes?: ReadonlyArray<StreamProgram> | null } | null,
): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const node of programs?.nodes ?? []) {
    const channel = node?.channel;
    const group = channel?.channelGroup?.name;
    const name = channel?.name?.trim();
    if (!name || !group || !STREAM_GROUPS.has(group) || seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names;
}

type StreamSearch = {
  matches: (name: string) => boolean;
  href: (title: string) => string;
};

const encoded = (title: string) => encodeURIComponent(title);

/** チャンネル名ごとの、作品名検索URL。先に一致したものを使う */
const STREAM_SEARCHES: StreamSearch[] = [
  {
    matches: (name) => name.includes("dアニメ"),
    href: (title) => `https://animestore.docomo.ne.jp/animestore/sch_pc?searchKey=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("ABEMA"),
    href: (title) => `https://abema.tv/search?q=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("Amazon") || name.includes("プライム・ビデオ"),
    href: (title) => `https://www.amazon.co.jp/s?k=${encoded(title)}&i=instant-video`,
  },
  {
    matches: (name) => name.includes("Disney"),
    href: (title) => `https://www.disneyplus.com/ja-jp/search?q=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("DMM"),
    href: (title) => `https://tv.dmm.com/vod/list/?keyword=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("FOD") || name.includes("フジテレビオンデマンド"),
    href: (title) => `https://fod.fujitv.co.jp/psearch/?keyword=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("Hulu"),
    href: (title) => `https://www.hulu.jp/search?q=${encoded(title)}`,
  },
  {
    matches: (name) => /netflix/i.test(name),
    href: (title) => `https://www.netflix.com/search?q=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("U-NEXT") || name.includes("ユーネクスト"),
    href: (title) => `https://video.unext.jp/freeword?query=${encoded(title)}`,
  },
  {
    matches: (name) => /youtube/i.test(name) || name.includes("ユーチューブ"),
    href: (title) => `https://www.youtube.com/results?search_query=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("ニコニコ生放送"),
    href: (title) => `https://live.nicovideo.jp/search?keyword=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("ニコニコ"),
    href: (title) => `https://ch.nicovideo.jp/search/${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("バンダイ"),
    href: (title) => `https://www.b-ch.com/search/text/?search_txt=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("Lemino") || name.includes("レミノ"),
    href: (title) => `https://lemino.docomo.ne.jp/search?word=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("TELASA"),
    href: (title) => `https://www.telasa.jp/search?q=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("WOWOW"),
    href: (title) => `https://wod.wowow.co.jp/search?q=${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("TVer"),
    href: (title) => `https://tver.jp/search/${encoded(title)}`,
  },
  {
    matches: (name) => name.includes("楽天"),
    href: (title) => `https://tv.rakuten.co.jp/search/?genre_code=all&keyword=${encoded(title)}`,
  },
];

/** 配信サービス名に対応する、作品名の検索URL。対応がなければ null */
export function streamSearchUrl(serviceName: string, title: string): string | null {
  const query = title.trim();
  if (!query) return null;
  const search = STREAM_SEARCHES.find((item) => item.matches(serviceName));
  return search ? search.href(query) : null;
}
