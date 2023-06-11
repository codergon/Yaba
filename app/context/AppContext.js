import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeTabState, bookmarksDataState } from "../atoms/appState";
import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { getDomainFromURL } from "../screens/BrowsingHistory/services/helper";

export const AppContext = createContext({
  checklist: [],
  searchValue: "",
  historyItems: [],
  groupedHistory: {},
  openFilters: false,
  toDate: new Date(),
  orderByVisits: false,
  fromDate: new Date(),

  setToDate: () => {},
  setFromDate: () => {},
  setChecklist: () => {},
  setOpenFilters: () => {},
  setSearchValue: () => {},
  setOrderByVisits: () => {},
  addBookmark: () => Promise.resolve(),
  queryHistory: () => Promise.resolve(),
  deleteHistory: () => Promise.resolve(),
});

const DEFAULT_MAX_RESULTS = 3000;

export default function AppProvider({ children }) {
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState([]);
  const [toDate, setToDate] = useState(new Date());
  const [searchValue, setSearchValue] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [openFilters, setOpenFilters] = useState(false);
  const [orderByVisits, setOrderByVisits] = useState(false);
  const [maxResults, setMaxResult] = useState(DEFAULT_MAX_RESULTS);

  const setActiveTab = useSetRecoilState(activeTabState);
  const [bookmarks, setBookmarks] = useRecoilState(bookmarksDataState);

  const queryChrome = async (useDate = false) => {
    const endTime = toDate.getTime() + 86400000;

    const query = {
      text: "",
      maxResults,
      ...(useDate && {
        endTime,
        startTime: fromDate.getTime(),
      }),
    };

    const history = await chrome.history
      .search(query)
      .then(historyItems => historyItems);

    const filteredDates = history.filter(
      item =>
        item.lastVisitTime >= fromDate.getTime() &&
        item.lastVisitTime <= endTime
    );

    setHistoryItems(
      useDate ? filteredDates : _.orderBy(history, ["lastVisitTime"], ["desc"])
    );
  };

  useEffect(() => {
    queryChrome();
  }, [maxResults]);

  // Functions
  const addBookmark = async ({
    link,
    title,
    metas,
    action,
    dateVal,
    favicon,
    categs = [],
    expired = true,
    openTab = false,
    repeat = "never",
    urlDescription = "",
  }) => {
    if (isNaN(dateVal?.getTime()) || !title || !link) return;

    const newBookmark = {
      link,
      title,
      repeat,
      expired,
      paused: false,
      shared: false,
      sharedWith: [],
      categories: categs,
      autoTrigger: openTab,
      id: crypto.randomUUID(),
      description: urlDescription,
      date: Number(dateVal.getTime()),
      thumbnail: favicon || metas?.og?.image || metas?.twitter?.image,
    };

    if (action === "share") {
      navigate("/share-bookmark", { state: newBookmark });
    } else {
      const newList = bookmarks ? [newBookmark, ...bookmarks] : [newBookmark];
      setBookmarks(newList);

      setActiveTab("bookmarks");
      navigate("/");
    }
  };

  const deleteHistory = async url => {
    await chrome.history.deleteUrl({ url: url });
    await queryChrome();
  };

  const groupedHistory = useMemo(() => {
    const groupedData = {};

    const filteredHistory = historyItems.filter(item => {
      const domain = getDomainFromURL(item.url);
      return (
        (checklist.length === 0 || checklist.includes(domain)) &&
        (item?.url?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
          item?.title?.toLowerCase().includes(searchValue?.toLowerCase()))
      );
    });

    filteredHistory.forEach(item => {
      const lastVisitTime = item.lastVisitTime;
      const date = new Date(lastVisitTime).toDateString();
      if (groupedData[date]) {
        groupedData[date].push(item);
        if (orderByVisits)
          groupedData[date]?.sort((a, b) => b.visitCount - a.visitCount);
      } else {
        groupedData[date] = [item];
      }
    });

    return groupedData;
  }, [searchValue, historyItems, checklist]);

  return (
    <AppContext.Provider
      value={{
        toDate,
        fromDate,
        checklist,
        searchValue,
        openFilters,
        historyItems,
        orderByVisits,
        groupedHistory,

        setToDate,
        setFromDate,
        addBookmark,
        setChecklist,
        deleteHistory,
        setOpenFilters,
        setSearchValue,
        setOrderByVisits,
        queryHistory: queryChrome,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  return useContext(AppContext);
}
