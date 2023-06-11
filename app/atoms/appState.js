import _ from "lodash";
import dayjs from "dayjs";
import { atom, selector } from "recoil";
import { storageGet, storageSet } from "../utils/helpers";

const storageEffect =
  (key, defaultVal) =>
  async ({ onSet, setSelf }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await chrome.storage.sync.set(obj);
    });

    setSelf((await chrome.storage.sync.get(key))[key] || defaultVal);
  };

const JsonStorageEffect =
  (key, defaultVal) =>
  async ({ onSet, setSelf }) => {
    onSet(async newValue => {
      let obj = { [key]: newValue };
      await storageSet(obj);
    });

    setSelf((await storageGet([key]))[key] || defaultVal);
  };

export const UserState = atom({
  default: "",
  key: "user",
  effects: [JsonStorageEffect("user")],
});

export const userIdState = atom({
  key: "userId",
  default: "",
  effects: [storageEffect("userId")],
});

export const isLoggedInState = atom({
  key: "isLoggedIn",
  default: false,
  effects: [storageEffect("isLoggedIn")],
});

export const fullScreenState = atom({
  key: "isFullscreen",
  default: false,
  // effects: [storageEffect("isFullscreen")],
});
//=====

export const prefsState = atom({
  key: "prefs",
  default: { isFixed: false, cmdOpen: false, cmdMark: false },
  effects: [JsonStorageEffect("prefs")],
});

export const categoriesDataState = atom({
  default: [],
  key: "categories",
  effects: [JsonStorageEffect("categories", [])],
});

export const activeTabState = atom({
  key: "activeTab",
  default: "notifications",
});

export const activeControlState = atom({
  key: "activeControl",
  default: "bookmarks",
  // default: "workspace",
});

export const bookmarksDataState = atom({
  key: "bookmarksArr",
  default: [],
  effects: [JsonStorageEffect("bookmarksArr")],
});

export const spaceTimestampState = atom({
  key: "spaceTimestamp",
  default: null,
  effects: [JsonStorageEffect("spaceTimestamp", null)],
});

export const getScreenState = atom({
  key: "getScreenState",
  default: null,
  effects: [
    async ({ setSelf }) => {
      setSelf((await storageGet(["bookmarksArr"]))["bookmarksArr"]);
    },
  ],
});

// ================================================
export const searchSpaceItems = atom({
  key: "searchSpaces",
  default: "",
});

export const spacesError = atom({
  key: "fetchSpacesError",
  default: "",
});
export const spacesLoading = atom({
  key: "fetchSpacesLoading",
  default: true,
});

export const spaceItems = atom({
  key: "spaceItems",
  default: [],
});

export const totalUnread = atom({
  key: "totalUnread",
  default: 0,
});

export const filteredSpaces = selector({
  key: "filteredSpaces",
  get: ({ get }) => {
    const spaces = get(spaceItems);
    const search = get(searchSpaceItems);

    const fltrd = _.filter(spaces, space => {
      if (search?.length === 0) return true;
      return space?.bookmark?.title
        ?.toLowerCase()
        ?.includes(search?.toLowerCase()?.trim());
    });

    const srtd = fltrd?.sort((a, b) =>
      Number(a?.dateUpdated) > Number(b?.dateUpdated) ? -1 : 0
    );

    return srtd;
  },
});

// ================================================

export const searchBmkState = atom({
  key: "searchBookmark",
  default: "",
});

export const groupByState = atom({
  key: "groupBy",
  default: "all",
  effects: [storageEffect("groupBy")],
});

const isActive = item => (item?.expired ? "History" : "Active");
const monthName = item => dayjs(JSON.parse(item.date)).format("MMMM");
const category = item =>
  Array.isArray(item?.categories)
    ? item?.categories[0]
      ? item?.categories[0]
      : "Uncategorized"
    : "Uncategorized";

const monthNameNotif = item => dayjs(item?.time).format("MMM");

export const groupedBmkState = selector({
  key: "groupedBmk",
  get: ({ get }) => {
    const filter = get(groupByState);
    const search = get(searchBmkState);
    const list = get(bookmarksDataState);

    const filtered = _.filter(list, rem => {
      return (
        _.values(_.omit(rem, ["id"])).filter(txt => {
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
          .groupBy(item => "all")
          .value();
    }
  },
});

// Notification
// ===================================
export const unreadState = atom({
  key: "unread",
  default: false,
  // effects: [storageEffect("unread")],
});

export const activeNotifTabState = atom({
  key: "activeNotifTab",
  default: "all",
});
export const notifDataState = atom({
  key: "notifications",
  default: [],
  effects: [JsonStorageEffect("notifications")],
});

export const groupNotifState = atom({
  key: "groupNotifBy",
  default: "all",
  effects: [storageEffect("groupNotifBy")],
});

export const searchNotifState = atom({
  key: "searchNotif",
  default: "",
});

export const groupedNotifState = selector({
  key: "groupedNotif",
  get: ({ get }) => {
    const list = get(notifDataState);
    const filter = get(groupNotifState);
    const search = get(searchNotifState);

    const filtered = _.filter(
      list,
      notif =>
        _.values(_.omit(notif, ["id", "date"])).filter(txt => {
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
          .groupBy(item => "all")
          .value();
    }
  },
});
