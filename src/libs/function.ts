import Const from "~/constants";
import { getLocalStorageItem } from "~/libs/storage";

function toMinute(value: Date | string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.floor(time / 60000);
}

/** 作成と更新が同じ分でなければ、編集されたものとして扱う */
export function wasEdited(createdAt: Date | string, updatedAt: Date | string) {
  const created = toMinute(createdAt);
  const updated = toMinute(updatedAt);
  if (created === null || updated === null) return false;
  return created !== updated;
}

export function getMutedUsers(): { annictId: number, username: string }[] {
  const raw = getLocalStorageItem(Const.STORAGE_MUTED_USERS);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is { annictId: number, username: string } => {
      if (!item || typeof item !== "object") return false;
      const user = item as { annictId?: unknown, username?: unknown };
      return typeof user.annictId === "number" && typeof user.username === "string";
    });
  } catch {
    return [];
  }
}
