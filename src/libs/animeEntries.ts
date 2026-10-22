import type { LibraryEntriesQuery, LibraryEntry } from "~/features/apollo/generated-types";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export type EntriesByDay = {
  day: string;
  list: LibraryEntry[];
};

function orderEntriesByWeekday(entriesDate: EntriesByDay[]): EntriesByDay[] {
  const todayIndex = new Date().getDay();
  return entriesDate.slice(todayIndex).concat(entriesDate.slice(0, todayIndex));
}

/** libraryEntries を視聴可能と曜日別（週間予定）に振り分ける */
export function splitLibraryEntries(data: LibraryEntriesQuery | undefined, now: number) {
  const nodes = (data?.viewer?.libraryEntries?.nodes ?? []).filter(
    (node): node is LibraryEntry => node != null,
  );

  const withProgram = nodes
    .filter((node) => node.nextProgram != null)
    .slice()
    .sort(
      (a, b) =>
        new Date(a.nextProgram!.startedAt).getTime() - new Date(b.nextProgram!.startedAt).getTime(),
    );
  const noProgram = nodes.filter((node) => node.nextProgram == null);

  const delivered: LibraryEntry[] = [];
  const allByDay: EntriesByDay[] = WEEKDAYS.map((day) => ({ day, list: [] }));

  withProgram.forEach((entry) => {
    const startedAt = new Date(entry.nextProgram!.startedAt);
    if (now > startedAt.getTime()) {
      delivered.push(entry);
    }
    const day = WEEKDAYS[startedAt.getDay()];
    const bucket = allByDay.find((item) => item.day === day);
    bucket?.list.push(entry);
  });

  const all = orderEntriesByWeekday(allByDay).filter((entry) => entry.list.length > 0);

  return { delivered, all, noProgram };
}
