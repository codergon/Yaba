import Navbar from "./Navbar";
import StaticButton from "./StaticButton";
import Settings from "../screens/Settings";
import Bookmarks from "../screens/Bookmarks";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  UserState,
  spaceItems,
  unreadState,
  spacesError,
  spacesLoading,
  activeTabState,
  activeControlState,
} from "../atoms/appState";
import { useEffect } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fb";
import BrowsingHistory from "../screens/BrowsingHistory";

const Tabs = () => {
  const user = useRecoilValue(UserState);
  const setError = useSetRecoilState(spacesError);
  const setUnread = useSetRecoilState(unreadState);
  const setLoading = useSetRecoilState(spacesLoading);
  const [spaces, setSpaces] = useRecoilState(spaceItems);
  const activeControl = useRecoilValue(activeControlState);
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  const tabsControls = [
    {
      title: "bookmarks",
      component: <Bookmarks />,
    },
    {
      title: "history",
      component: <BrowsingHistory />,
    },
    {
      title: "settings",
      component: <Settings />,
    },
  ];

  const FetchSpaces = async () => {
    setLoading(true);
    try {
      const wSpaces = [];
      const q = query(
        collection(db, "workspaces"),
        where("members", "array-contains", user?.email)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        wSpaces.push(doc.data());
      });

      setSpaces(wSpaces);
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const markUnread = async () => {
    await chrome.storage.sync.set({ unread: 0 });
    setUnread(false);
    chrome.action.setBadgeText({ text: "" });
  };

  useEffect(() => {
    markUnread();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    FetchSpaces();
  }, [user?.uid]);

  return (
    <>
      {tabsControls.find(control => control.title === activeTab)?.component}

      {activeTab === "bookmarks" && activeControl === "bookmarks" && (
        <StaticButton />
      )}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

export default Tabs;
