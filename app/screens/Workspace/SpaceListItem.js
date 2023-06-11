import dayjs from "dayjs";
import Icons from "../../common/Icons";
import { useNavigate } from "react-router-dom";
import { isToday } from "../../utils/helpers";
import { useEffect, useState } from "react";
import {
  where,
  query,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../fb";
import { useRecoilValue } from "recoil";
import { spaceTimestampState } from "../../atoms/appState";
import { Bookmark } from "phosphor-react";

const SpaceListItem = ({ space, setUnreadSpaces }) => {
  const { bookmark } = space;
  let navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const date = space?.dateUpdated?.toDate();
  const daysAgo = dayjs(date).diff(new Date(), "days");
  const dateIsToday = isToday(date);
  const dateIsYesterday = daysAgo === -1;
  const dateIsThisWeek = Math.abs(daysAgo) <= 6;

  const EnterSpace = () => navigate("/space-area", { state: space });

  const [unread, setUnread] = useState(null);
  const spaceTimestamp = useRecoilValue(spaceTimestampState);

  const FetchUnreadCount = async () => {
    if (!space?.id || !spaceTimestamp) return;
    if (spaceTimestamp?.hasOwnProperty(space?.id)) {
      const q = query(
        collection(db, "comments"),
        where("workspaceId", "==", space?.id),
        where("dateCreated", ">", spaceTimestamp[space?.id])
      );
      const snapshot = await getCountFromServer(q);
      setUnread(snapshot.data().count);
      setUnreadSpaces(prev => {
        return {
          ...prev,
          [space?.id]: snapshot.data().count,
        };
      });
    }
  };

  useEffect(() => {
    FetchUnreadCount();
  }, [space?.uid, space?.messageCount, spaceTimestamp]);

  return (
    <button className="workspace__item" onClick={EnterSpace}>
      <div className="workspace__item-media">
        {bookmark?.image ? (
          <div className="image-cover">
            <img
              src={bookmark?.image}
              alt=""
              onLoad={e => setImgLoaded(true)}
            />
            {!imgLoaded ? (
              <div className="placeholder">
                <Bookmark size={20} weight="fill" color={"#B3B3B3"} />
              </div>
            ) : null}
          </div>
        ) : (
          <Bookmark size={20} weight="fill" color={"#B3B3B3"} />
        )}
      </div>

      <div className="workspace__item__details">
        <div className="workspace__item__details-content">
          <p className="workspace__item__details-title">{bookmark?.title}</p>
          <div className="workspace__item__details-sub">
            <p className="workspace__item__details-date">
              {(dateIsToday ? "" : dateIsYesterday ? "Yesterday, " : "") +
                dayjs(date).format(
                  dateIsToday
                    ? "HH:mm"
                    : dateIsYesterday
                    ? ""
                    : dateIsThisWeek
                    ? "dddd"
                    : "ddd, D MMM"
                )}
            </p>
          </div>
        </div>

        <div className="workspace__item__actions">
          {bookmark?.description ? (
            <p className="workspace__item__details-description">
              {bookmark?.description}
            </p>
          ) : (
            <div />
          )}

          {unread !== null && unread > 0 && (
            <div className="workspace__item__details-unread">
              {unread > 99 ? "99+" : unread}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default SpaceListItem;
