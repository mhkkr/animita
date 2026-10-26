import type { StatusState } from "~/features/apollo/generated-types";

import Const from "~/constants";

export type LibraryStatusId = (typeof Const.STATUS_STATE_LIST)[number]["id"];

function librarySlug(id: string) {
  return id.toLowerCase();
}

export function libraryTabHref(id: LibraryStatusId) {
  return `/library/${librarySlug(id)}`;
}

export function libraryTabFromSegments(segments: string[] | undefined): LibraryStatusId | null {
  if (!segments || segments.length === 0) return Const.STATUS_STATE_LIST[0].id;
  if (segments.length !== 1) return null;
  const tab = Const.STATUS_STATE_LIST.find((item) => librarySlug(item.id) === segments[0]);
  return tab?.id ?? null;
}

export function libraryTabFromPathname(pathname: string): LibraryStatusId | null {
  if (pathname === "/library") return Const.STATUS_STATE_LIST[0].id;
  if (!pathname.startsWith("/library/")) return null;
  return libraryTabFromSegments(pathname.slice("/library/".length).split("/"));
}

export function libraryStatusState(id: LibraryStatusId): StatusState {
  return id as StatusState;
}
