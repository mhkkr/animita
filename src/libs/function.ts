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
  const mutedUsers = getLocalStorageItem(Const.STORAGE_MUTED_USERS);
  return mutedUsers ? JSON.parse(mutedUsers) : [];
}
