import { useEffect } from "react";
import Icons from "../common/Icons";
import { useRecoilState } from "recoil";
import { unreadState } from "../atoms/appState";
import { BookmarkMinus, History, Settings } from "lucide-react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const [unread, setUnread] = useRecoilState(unreadState);

  const checkUnread = async () => {
    const { unread } = await chrome.storage.sync.get("unread");
    setUnread(!isNaN(unread) ? !!(unread > 0) : false);
  };

  useEffect(() => {
    checkUnread();
  }, []);

  return (
    <div className="ext-navbar">
      <button
        data-active={activeTab === "bookmarks"}
        onClick={e => setActiveTab("bookmarks")}
      >
        <BookmarkMinus size={19} />
      </button>

      <button
        data-active={activeTab === "notifications"}
        onClick={e => setActiveTab("notifications")}
      >
        <History size={18.5} />
      </button>

      <button
        data-active={activeTab === "settings"}
        onClick={e => setActiveTab("settings")}
      >
        <Settings size={19} />
      </button>
    </div>
  );
};

export default Navbar;
