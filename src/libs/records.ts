/** 接続の null や、user が欠落したキャッシュを描画対象から外す */
export function recordsWithUser<T extends { user?: unknown }>(
  records: readonly (T | null | undefined)[] | null | undefined,
): T[] {
  return (records ?? []).filter((record): record is T => record != null && record.user != null);
}
