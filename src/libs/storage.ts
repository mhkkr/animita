export function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getLocalStorageItem(key: string): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }
  return localStorage.getItem(key);
}

export function setLocalStorageItem(key: string, value: string) {
  if (!canUseLocalStorage()) {
    return;
  }
  localStorage.setItem(key, value);
}

export function removeLocalStorageItem(key: string) {
  if (!canUseLocalStorage()) {
    return;
  }
  localStorage.removeItem(key);
}
