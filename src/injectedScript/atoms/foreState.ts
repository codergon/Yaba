import { getURL } from "../utils/helpers";
import { atom, selector, AtomEffect } from "recoil";

const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ onSet }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.local.set(obj);
    });
  };

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

// =========================================

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

export const pageMarkersObj = atom<{ [key: string]: any }>({
  key: "pageMarkers",
  default: {},
  effects_UNSTABLE: [localStorageEffect("pageMarkers")],
});

export const currMarkersObj = selector<any[]>({
  key: "currMarkers",
  get: ({ get }) => {
    const url = getURL();
    const pageMarkers = get(pageMarkersObj);
    const urlMarkers = pageMarkers[url];

    return !!urlMarkers ? urlMarkers : [];
  },
});
