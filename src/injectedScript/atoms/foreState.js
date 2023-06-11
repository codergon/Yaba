import { atom, selector } from "recoil";
import { getURL } from "../utils/helpers";

const localStorageEffect =
  key =>
  async ({ onSet }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.sync.set(obj);
    });
  };

// =========================================

export const reminderDataState = atom({
  key: "remsArray",
  default: [],
});

export const showMarkerState = atom({
  key: "showMarker",
  default: false,
});

export const currentActionState = atom({
  key: "currentAction",
  default: "none",
});

export const markerPositionState = atom({
  key: "markerPosition",
  default: { top: 0, left: 0 },
});

export const pageMarkersObj = atom({
  key: "pageMarkers",
  default: {},
  effects: [localStorageEffect("pageMarkers")],
});

export const currMarkersObj = selector({
  key: "currMarkers",
  get: ({ get }) => {
    const url = getURL();
    const pageMarkers = get(pageMarkersObj);
    const urlMarkers = pageMarkers[url];

    return !!urlMarkers ? urlMarkers : [];
  },
});
