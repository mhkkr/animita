import type {
  LibraryEntriesQuery,
  LibraryEntryDetailQuery,
} from "~/features/apollo/generated-types";

/** 一覧フル取得 / 詳細軽量取得のどちらでも渡せる形 */
export type LibraryEntriesData =
  | LibraryEntriesQuery
  | LibraryEntryDetailQuery
  | null
  | undefined;
