import "./styles/main.scss";
import {
  UserState,
  unreadState,
  notifDataState,
  bookmarksDataState,
} from "./atoms/appState";
import Tabs from "./layout/Tabs";
import Loader from "./common/Loader";
import Splash from "./screens/Onboarding";
import { useEffect, useState } from "react";
import AppProvider from "./context/AppContext";
import AddBookmark from "./screens/SetBookmark";
import ShareScreen from "./screens/Sharescreen";
import SpaceArea from "./screens/Workspace/SpaceArea";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const setUnread = useSetRecoilState(unreadState);
  const [user, setUser] = useRecoilState(UserState);
  const setNotifData = useSetRecoilState(notifDataState);
  const setBookmarksData = useSetRecoilState(bookmarksDataState);

  const [loading, setLoading] = useState(true);

  const applyTheme = async () => {
    document.documentElement.setAttribute("data-theme", "light");
  };

  const verifyAuth = async () => {
    const { user } = await chrome.storage.local.get("user");
    if (!user?.uid) {
      setUser(null);
    }
    setUser(user);
    if (loading) setLoading(false);
  };

  useEffect(() => {
    applyTheme();
    verifyAuth();
  }, []);

  const checkUnread = async () => {
    const { unread } = await chrome.storage.local.get("unread");
    setUnread(!isNaN(unread) ? !!(unread > 0) : false);
  };

  chrome.runtime.onMessage.addListener(function (request, sender, sendRes) {
    if (request.cmd == "refetch") {
      if (Array.isArray(request?.updatedList)) {
        setBookmarksData(request?.updatedList);
        checkUnread();
        if (Array.isArray(request?.updatedList))
          setNotifData(request?.newNotifications);
      }
      sendRes("Refetched");
    }
    if (request.cmd == "refresh-auth-popup") {
      verifyAuth();
      sendRes("Done");
    }
  });

  return loading ? (
    <></>
  ) : (
    <div className="ext-container">
      <Router>
        <AppProvider>
          <Routes>
            {!user?.uid ? (
              <Route exact path="/" element={<Splash />} />
            ) : (
              <>
                <Route exact path="/" element={<Tabs />} />

                <Route exact path="/space-area" element={<SpaceArea />} />
                <Route exact path="/share-bookmark" element={<ShareScreen />} />
                <Route
                  exact
                  path="/create-bookmark"
                  element={<AddBookmark />}
                />
                <Route path="*" element={<Loader />} />
              </>
            )}
          </Routes>
        </AppProvider>
      </Router>
    </div>
  );
};

export default App;
