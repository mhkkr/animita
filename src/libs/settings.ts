import type { Setting, Category, Id } from '~/types/settings';

export const displays = {
  ["peoples-records"]: {
    value: [
      { id: "invisible", label: "非表示にする" },
      { id: "record-after-visible", label: "評価するまで非表示にする" },
      { id: "visible", label: "表示する" },
    ],
    default: "visible"
  },
  evaluation: {
    value: [
      { id: "invisible", label: "非表示にする" },
      { id: "record-after-visible", label: "評価するまで非表示にする" },
      { id: "visible", label: "表示する" },
    ],
    default: "visible"
  }
};

export function setSetting(category: Category, id: Id, newValue: any) {
  const storage = localStorage.getItem("settings");
  const settings: Setting = storage ? JSON.parse(storage) : { [category]: { [id]: undefined } };
  settings[category][id] = newValue;
  localStorage.setItem("settings", JSON.stringify(settings));
}

export function getSetting(category: Category, id: Id) {
  const storage = localStorage.getItem("settings");
  if (storage) {
    const settings = JSON.parse(storage) as Setting;
    if (settings[category] && settings[category][id]) {
      return settings[category][id];
    }
  }
  return displays[id].default;
}