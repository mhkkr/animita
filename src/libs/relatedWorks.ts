type ParsedRelatedWork = {
  annictId: number;
  title: string;
};

export type ParsedRelatedSeries = {
  name: string;
  works: ParsedRelatedWork[];
};

function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const CARD_PATTERN = /<a href="\/works\/(\d+)" class="text-body"><div class="c-work-card__work-title[^"]*" title="([^"]*)">[\s\S]*?<\/div>(?:<div class="small text-muted text-truncate" title="([^"]*)">)?/;

/**
 * Annict GraphQL の series.works は別作品の ID を返し、
 * title などを読むと HTTP 500 になる。
 * 関連作品ページに出ている作品を使う。
 */
export function parseRelatedWorks(html: string): ParsedRelatedSeries[] {
  const series: ParsedRelatedSeries[] = [];

  for (const chunk of html.split(/<h2\b/i).slice(1)) {
    const headingMatch = chunk.match(/^[^>]*>\s*([\s\S]*?)<\/h2>/);
    if (!headingMatch) continue;

    const heading = decodeHtml(headingMatch[1].replace(/<[^>]+>/g, ""));
    if (!heading.endsWith("シリーズ")) continue;

    const name = heading.replace(/シリーズ$/, "").trim();
    const works: ParsedRelatedWork[] = [];
    const seen = new Set<number>();
    const pattern = new RegExp(CARD_PATTERN.source, "g");
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(chunk)) !== null) {
      const annictId = Number(match[1]);
      if (!Number.isInteger(annictId) || seen.has(annictId)) continue;
      seen.add(annictId);
      works.push({
        annictId,
        title: decodeHtml(match[2]),
      });
    }

    if (name && works.length > 0) {
      series.push({ name, works });
    }
  }

  return series;
}
