import Navbar from "./Navbar";
import StaticButton from "./StaticButton";
import Settings from "../screens/Settings";
import Bookmarks from "../screens/Bookmarks";
import Notifications from "../screens/Notifications";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  UserState,
  spaceItems,
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
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);
  const activeControl = useRecoilValue(activeControlState);

  const tabsControls = [
    {
      title: "bookmarks",
      component: <Bookmarks />,
    },
    {
      title: "notifications",
      component: <BrowsingHistory />,
    },
    {
      title: "settings",
      component: <Settings />,
    },
  ];

  const user = useRecoilValue(UserState);
  const setError = useSetRecoilState(spacesError);
  const setLoading = useSetRecoilState(spacesLoading);
  const [spaces, setSpaces] = useRecoilState(spaceItems);

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
