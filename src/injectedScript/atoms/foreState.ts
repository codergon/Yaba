import { atom, AtomEffect } from "recoil";

const storageEffect =
  <T>(key: string, defaultVal?: any): AtomEffect<T> =>
  // @ts-ignore
  async ({ onSet, setSelf }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.local.set(obj);
    });

    setSelf((await chrome.storage.local.get(key))[key] || defaultVal);
  };

export const notebookTasksState = atom<any[]>({
  key: "notebookTasks",
  default: [],
  effects: [storageEffect("notebookTasks", [])],
});

export const notebookNotesState = atom<any[]>({
  key: "notebookNotes",
  default: [],
  effects: [storageEffect("notebookNotes", [])],
});

export const reminderDataState = atom<any[]>({
  key: "remsArray",
  default: [],
});

export const showMarkerState = atom<boolean>({
  key: "showMarker",
  default: false,
});

export const currentActionState = atom<string>({
  key: "currentAction",
  default: "none",
});

export const markerPositionState = atom<{ top: number; left: number }>({
  key: "markerPosition",
  default: { top: 0, left: 0 },
});
