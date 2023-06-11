import "./styles/main.scss";
import {
  UserState,
  unreadState,
  notifDataState,
  bookmarksDataState,
} from "./atoms/appState";
import { store } from "./store";
import Tabs from "./layout/Tabs";
import { useEffect } from "react";
import Loader from "./common/Loader";
import { Provider } from "react-redux";
import Splash from "./screens/Onboarding";
import AddBookmark from "./screens/SetBookmark";
import ShareScreen from "./screens/Sharescreen";
import SpaceArea from "./screens/Workspace/SpaceArea";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import AppProvider from "./context/AppContext";

const App = () => {
  const applyTheme = async () => {
    document.documentElement.setAttribute("data-theme", "light");
  };

  useEffect(() => {
    applyTheme();
  }, []);

  const user = useRecoilValue(UserState);
  const setUnread = useSetRecoilState(unreadState);
  const setNotifData = useSetRecoilState(notifDataState);
  const setBookmarksData = useSetRecoilState(bookmarksDataState);

  const checkUnread = async () => {
    const { unread } = await chrome.storage.sync.get("unread");
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
  });

  return (
    <Provider store={store}>
      <div className="ext-container">
        <Router>
          <AppProvider>
            <Routes>
              {user === null || user === undefined || !user ? (
                <Route exact path="/" element={<Splash />} />
              ) : (
                <>
                  <Route exact path="/" element={<Tabs />} />

                  <Route exact path="/space-area" element={<SpaceArea />} />
                  <Route
                    exact
                    path="/share-bookmark"
                    element={<ShareScreen />}
                  />
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
    </Provider>
  );
};

export default App;
