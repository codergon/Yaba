import Icons from "../../common/Icons";
import ReactTimeAgo from "react-time-ago";
import { Fragment, useState } from "react";
import Vectors from "../../common/Vectors";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeNotifTabState,
  groupedNotifState,
  groupNotifState,
  notifDataState,
} from "../../atoms/appState";

const NotifItem = ({ item }) => {
  const [notifData, setNotifData] = useRecoilState(notifDataState);

  const deleteNotification = () => {
    const newList = notifData.filter(i => i.id !== item?.id);
    setNotifData(newList);
  };

  return (
    <div className="notifications__item">
      <div className="notifications__item__contents">
        <div className="media">
          {item?.type === "reminder" ? (
            <Vectors.clock />
          ) : item?.type ? (
            <Vectors.comments />
          ) : (
            <Vectors.marker />
          )}
        </div>

        <div className="details">
          {item?.type === "comment" && (
            <img
              src="https://images.generated.photos/-a9yG_Tgh3KPeJanYQ9E4gSIdi8rYfdJmJa4EKQA2pQ/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDkwMzYwLmpwZw.jpg"
              alt=""
            />
          )}
          <p className="title">
            {item?.type === "reminder" ? (
              <>
                <span>Reminder</span> -{" "}
                {item?.link ? new URL(item.link).host : null}
              </>
            ) : (
              <>
                <span>James Dean</span>{" "}
                {item?.type === "comment" ? "commented" : "annotated"} on your
                bookmark
              </>
            )}
          </p>
        </div>

        <Menu
          menuButton={
            <button className="options-btn">
              <Icons.ellipsis />
            </button>
          }
          align="end"
          transition
          menuClassName="menu-container"
        >
          <MenuItem className="menu-item" onClick={deleteNotification}>
            <Icons.delete />
            <p>Remove</p>
          </MenuItem>
        </Menu>
      </div>

      <div className="reminder-dets">
        <a href={item?.link} target="_blank" className="bkmk-link">
          <p>{item?.description}</p>
        </a>

        {!!item?.time ? (
          <div className="reminder-date">
            <ReactTimeAgo
              date={Number(item?.time)}
              locale="en-US"
              timeStyle="round"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const GroupedItems = ({ item }) => {
  const groupBy = useRecoilValue(groupNotifState);
  const [openGroup, setOpenGroup] = useState(true);
  const groupedNotifs = useRecoilValue(groupedNotifState);
  const activeControl = useRecoilValue(activeNotifTabState);

  return (
    <Fragment>
      {item === groupBy && item === "all" ? null : (
        <div className="notifications-group-hdr">
          <p>{item}</p>
          <button
            onClick={e => {
              setOpenGroup(p => !p);
            }}
          >
            {openGroup ? <Icons.caretup /> : <Icons.caretdown />}
          </button>
        </div>
      )}

      {openGroup ? (
        <div className="notifications__items" data-open={openGroup}>
          {groupedNotifs[item]?.map((item, index) => {
            return activeControl === "reminders" ? (
              item?.type === "reminder" ? (
                <NotifItem item={item} key={index} />
              ) : null
            ) : (
              <NotifItem item={item} key={index} />
            );
          })}
        </div>
      ) : null}
    </Fragment>
  );
};

const Notification = ({}) => {
  const groupedNotifs = useRecoilValue(groupedNotifState);

  return groupedNotifs && Object.keys(groupedNotifs)?.length > 0 ? (
    <div className="notifications">
      {Object.keys(groupedNotifs)?.map((key, ind) => (
        <GroupedItems key={ind} item={key} />
      ))}
    </div>
  ) : (
    <div className="notifications">
      <div className="empty-screen">
        <Vectors.notification />
        <p className="main">Nothing to see here</p>
        <p className="sub">
          There are no notifications to see here <br /> at the moment
        </p>
      </div>
    </div>
  );
};

export default Notification;
