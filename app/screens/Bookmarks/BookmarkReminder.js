import { useState } from "react";
import { useRecoilState } from "recoil";
import { isToday } from "../../utils/helpers";
import ReminderModal from "../SetBookmark/ReminderModal";
import { bookmarksDataState } from "../../atoms/appState";
import { getReminderTimer } from "../SetBookmark/helpers";

const BookmarkReminder = ({ item, openRemTab, setOpenRemTab }) => {
  const [remindIn, setRemindIn] = useState(0);
  const [repeat, setRepeat] = useState("never");
  const [bookmarksData, setBookmarksData] = useRecoilState(bookmarksDataState);

  const [autoTrig, setAutoTrig] = useState(false);

  const onSetCustom = dateVal => {
    const dateCheck = new Date();
    const newList = bookmarksData.map(rem => {
      if (rem.id === item?.id) {
        return {
          ...rem,
          repeat,
          paused: false,
          autoTrigger: autoTrig,
          date: Number(dateVal.getTime()),
          expired:
            isToday(dateVal) &&
            dateVal?.getHours() <= dateCheck.getHours() &&
            dateVal?.getMinutes() <= dateCheck.getMinutes(),
        };
      } else {
        return rem;
      }
    });
    setBookmarksData(newList);
    setOpenRemTab(false);
  };

  const onRemindInChange = option => setRemindIn(option);

  return (
    openRemTab && (
      <ReminderModal
        {...{
          repeat,
          remindIn,
          setRepeat,
          onSetCustom,
          setOpenRemTab,
          onRemindInChange,

          autoTrig,
          setAutoTrig,
        }}
      />
    )
  );
};

export default BookmarkReminder;
