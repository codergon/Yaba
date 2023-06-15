import _ from "lodash";
import dayjs from "dayjs";
import { AtomEffect, atom, selector } from "recoil";
import { storageGet, storageSet } from "../utils/helpers";

const storageEffect =
  <T>(key: string, defaultVal?: any): AtomEffect<T> =>
  ({ onSet, setSelf }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.sync.set(obj);

      setSelf((await chrome.storage.sync.get(key))[key] || defaultVal);
    });
  };

const JsonStorageEffect =
  <T>(key: string, defaultVal?: any): AtomEffect<T> =>
  // @ts-ignore
  async ({ onSet, setSelf }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.sync.set(obj);
    });

    setSelf((await storageGet([key]))[key] || defaultVal);
  };
export const UserState = atom<string>({
  default: "",
  key: "user",
  effects: [JsonStorageEffect("user")],
});

export const userIdState = atom<string>({
  key: "userId",
  default: "",
  effects: [storageEffect("userId")],
});

export const isLoggedInState = atom<boolean>({
  key: "isLoggedIn",
  default: false,
  effects: [storageEffect("isLoggedIn")],
});

export const fullScreenState = atom<boolean>({
  key: "isFullscreen",
  default: false,
  // effects: [storageEffect("isFullscreen")],
});

export const prefsState = atom<{
  isFixed: boolean;
  cmdOpen: boolean;
  cmdMark: boolean;
}>({
  key: "prefs",
  default: { isFixed: false, cmdOpen: false, cmdMark: false },
  effects: [JsonStorageEffect("prefs")],
});

export const categoriesDataState = atom<string[]>({
  default: [],
  key: "categories",
  effects: [JsonStorageEffect("categories", [])],
});

export const activeTabState = atom<string>({
  key: "activeTab",
  default: "bookmarks",
});

export const activeControlState = atom<string>({
  key: "activeControl",
  default: "bookmarks",
  // default: "workspace",
});

export const bookmarksDataState = atom<any[]>({
  key: "bookmarksArr",
  default: [],
  effects: [JsonStorageEffect("bookmarksArr")],
});

export const spaceTimestampState = atom<number | null>({
  key: "spaceTimestamp",
  default: null,
  effects: [JsonStorageEffect("spaceTimestamp", null)],
});

export const getScreenState = atom<any>({
  key: "getScreenState",
  default: null,
  effects: [
    // @ts-ignore
    async ({ setSelf }) => {
      setSelf((await storageGet(["bookmarksArr"]))["bookmarksArr"]);
    },
  ],
});

// ================================================
export const searchSpaceItems = atom<string>({
  key: "searchSpaces",
  default: "",
});

export const spacesError = atom<string>({
  key: "fetchSpacesError",
  default: "",
});
export const spacesLoading = atom<boolean>({
  key: "fetchSpacesLoading",
  default: true,
});

export const spaceItems = atom<any[]>({
  key: "spaceItems",
  default: [],
});

export const totalUnread = atom<number>({
  key: "totalUnread",
  default: 0,
});

export const filteredSpaces = selector<any[]>({
  key: "filteredSpaces",
  get: ({ get }) => {
    const spaces = get(spaceItems);
    const search = get(searchSpaceItems);

    const fltrd = _.filter(spaces, (space: any) => {
      if (search?.length === 0) return true;
      return space?.bookmark?.title
        ?.toLowerCase()
        ?.includes(search?.toLowerCase()?.trim());
    });

    const srtd = fltrd?.sort((a: any, b: any) =>
      Number(a?.dateUpdated) > Number(b?.dateUpdated) ? -1 : 0
    );

    return srtd;
  },
});

// ================================================

export const searchBmkState = atom<string>({
  key: "searchBookmark",
  default: "",
});

export const groupByState = atom<string>({
  key: "groupBy",
  default: "all",
  effects: [storageEffect("groupBy")],
});

const isActive = (item: any) => (item?.expired ? "History" : "Active");
const monthName = (item: any) => dayjs(JSON.parse(item.date)).format("MMMM");
const category = (item: any) =>
  Array.isArray(item?.categories)
    ? item?.categories[0]
      ? item?.categories[0]
      : "Uncategorized"
    : "Uncategorized";

const monthNameNotif = (item: any) => dayjs(item?.time).format("MMM");

export const groupedBmkState = selector<any>({
  key: "groupedBmk",
  get: ({ get }) => {
    const filter = get(groupByState);
    const search = get(searchBmkState);
    const list = get(bookmarksDataState);

    const filtered = _.filter(list, (rem: any) => {
      return (
        _.values(_.omit(rem, ["id"])).filter((txt: any) => {
          return typeof txt === "string"
            ? txt.toLowerCase()?.includes(search.toLowerCase().trim())
            : false;
        }).length > 0 ||
        dayjs(JSON.parse(rem?.date))
          .format("MMM DD")
          ?.toLowerCase()
          ?.includes(search.toLowerCase().trim())
      );
    });

    switch (filter) {
      case "category":
        return _.chain(filtered).groupBy(category).value();
      case "date":
        return _.chain(filtered).groupBy(monthName).value();
      case "status":
        return _.chain(filtered).groupBy(isActive).value();
      default:
        return _.chain(filtered)
          .groupBy((item: any) => "all")
          .value();
    }
  },
});

// Notification
// ===================================
export const unreadState = atom<boolean>({
  key: "unread",
  default: false,
  // effects: [storageEffect("unread")],
});

export const activeNotifTabState = atom<string>({
  key: "activeNotifTab",
  default: "all",
});
export const notifDataState = atom<any[]>({
  key: "notifications",
  default: [],
  effects: [JsonStorageEffect("notifications")],
});

export const groupNotifState = atom<string>({
  key: "groupNotifBy",
  default: "all",
  effects: [storageEffect("groupNotifBy")],
});

export const searchNotifState = atom<string>({
  key: "searchNotif",
  default: "",
});

export const groupedNotifState = selector<any>({
  key: "groupedNotif",
  get: ({ get }) => {
    const list = get(notifDataState);
    const filter = get(groupNotifState);
    const search = get(searchNotifState);

    const filtered = _.filter(
      list,
      (notif: any) =>
        _.values(_.omit(notif, ["id", "date"])).filter((txt: any) => {
          return typeof txt === "string"
            ? txt.toLowerCase()?.includes(search.toLowerCase().trim())
            : false;
        }).length > 0
    );

    switch (filter) {
      case "category":
        return _.chain(filtered).groupBy(category).value();
      case "date":
        return _.chain(filtered).groupBy(monthNameNotif).value();
      default:
        return _.chain(filtered)
          .groupBy((item: any) => "all")
          .value();
    }
  },
});
