import { getURL } from "../utils/helpers";
import { atom, selector, AtomEffect } from "recoil";

const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ onSet }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.sync.set(obj);
    });
  };

// =========================================

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
