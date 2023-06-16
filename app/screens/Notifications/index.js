import _ from "lodash";
import "./notifications.scss";
import { useEffect } from "react";
import Icons from "../../common/Icons";
import Header from "../../layout/Header";
import Notification from "./Notification";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  unreadState,
  groupNotifState,
  activeNotifTabState,
} from "../../atoms/appState";
import useAppMenu from "../../hooks/useAppMenu";
import { ListFilter } from "lucide-react";

const Notifications = () => {
  const setUnread = useSetRecoilState(unreadState);
  const [groupNotifsBy, setGroupNotif] = useRecoilState(groupNotifState);
  const [activeControl, setActiveControl] = useRecoilState(activeNotifTabState);

  const markUnread = async () => {
    await chrome.storage.local.set({ unread: 0 });
    setUnread(false);
    chrome.action.setBadgeText({ text: "" });
  };

  useEffect(() => {
    markUnread();
  }, []);

  const [AppMenu, activeOption] = useAppMenu(
    null,
    ["all", "date", "category"],
    v => setGroupNotif(v)
  );

  return (
    <>
      <Header label="Notifications" tabs={true} />

      <div className="base-tabs">
        <div className="base-tabs__configs">
          <div className="base-tabs__controls-row">
            <div className="base-tabs__controls notifictaion-controls">
              <div
                className="active-highlight"
                data-move={activeControl === "reminders"}
              />
              <button
                className="base-tabs__controls__btn"
                onClick={e => setActiveControl("all")}
              >
                All
              </button>
              <button
                className="base-tabs__controls__btn"
                onClick={e => setActiveControl("reminders")}
              >
                Reminders
              </button>
            </div>

            <div>
              <AppMenu textAlign="center" menuClass="filter-menu">
                <div className="block">
                  <button>
                    <ListFilter size={18} />
                  </button>
                </div>
              </AppMenu>
            </div>
          </div>
        </div>

        <div className="base-tabs__content">
          <Notification />
        </div>
      </div>
    </>
  );
};

export default Notifications;
