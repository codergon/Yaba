import Icons from "../../common/Icons";
import { useRecoilValue } from "recoil";
import BookmarkItem from "./BookmarkItem";
import { Fragment, useEffect, useState } from "react";
import {
  groupByState,
  getScreenState,
  groupedBmkState,
  bookmarksDataState,
  activeControlState,
} from "../../atoms/appState";
import EmptyState from "../../common/EmptyState";

const GroupedItems = ({ item, isFirst }) => {
  const groupBy = useRecoilValue(groupByState);
  const [noContact, setNoContact] = useState(true);
  const [openGroup, setOpenGroup] = useState(isFirst);
  const groupedBmks = useRecoilValue(groupedBmkState);
  const activeControl = useRecoilValue(activeControlState);

  useEffect(() => {
    const check = groupedBmks[item]?.filter(b => !!b?.shared).length <= 0;
    setNoContact(check && activeControl === "shared");
  }, [activeControl]);

  return (
    <Fragment>
      {item === groupBy && item === "all" ? (
        <div className="bookmarks-total">
          <p>{"All (" + groupedBmks[item]?.length + ")"}</p>
        </div>
      ) : noContact ? null : (
        <div
          className="bookmarks-group-hdr"
          onClick={e => setOpenGroup(p => !p)}
        >
          <p>{item}</p>
          {openGroup ? <Icons.caretup /> : <Icons.caretdown />}
        </div>
      )}

      {openGroup || (item === groupBy && item === "all") ? (
        <div
          className="bookmarks__items"
          data-open={openGroup || (item === groupBy && item === "all")}
        >
          {groupedBmks[item]?.map((item, index, arr) => {
            return <BookmarkItem item={item} key={index} />;
          })}
        </div>
      ) : null}
    </Fragment>
  );
};

const Bookmark = ({}) => {
  const groupBy = useRecoilValue(groupByState);
  const bkmks = useRecoilValue(bookmarksDataState);
  const screenState = useRecoilValue(getScreenState);
  const groupedBmks = useRecoilValue(groupedBmkState);
  const activeCtrl = useRecoilValue(activeControlState);

  const isShared =
    bkmks?.filter(item => item?.shared && item?.sharedWith?.length > 0)
      .length <= 0;

  return ((groupedBmks && Object.keys(groupedBmks)?.length > 0) ||
    screenState === null) &&
    !(activeCtrl === "shared" && isShared) ? (
    <div className="bookmarks">
      {Object.keys(groupedBmks)
        .sort()
        ?.map((key, ind) => (
          <GroupedItems key={ind} item={key} isFirst={ind === 0} />
        ))}
    </div>
  ) : (
    <div className="bookmarks">
      <EmptyState
        noMatch
        emptyList={bkmks?.length === 0}
        title={
          bkmks?.length > 0
            ? "No bookmarks were found related to your search keywords"
            : "Click on the button below to add bookmarks and set reminders"
        }
      />
    </div>
  );
};

export default Bookmark;
