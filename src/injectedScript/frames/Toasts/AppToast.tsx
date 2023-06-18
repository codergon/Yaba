import dayjs from "dayjs";
import { Timer } from "phosphor-react";
import { useRecoilState } from "recoil";
import { useRef, useState } from "react";
import Icons from "../../components/Icons";
import { useClickOut } from "../../hooks/useClickOut";
import { getReminderTimer } from "../../utils/helpers";
import { reminderDataState } from "../../atoms/foreState";
import { bookmarksDataState } from "../../../../app/atoms/appState";
// @ts-ignore
import ReminderModal from "../../../../app/screens/SetBookmark/ReminderModal";

const getPlaceholder = () => chrome.runtime.getURL("images/placeholder.png");

const AppToast = ({ item }: any) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dateVal, setDateVal] = useState(new Date());
  const [openSnooze, setOpenSnooze] = useState(false);
  const [remData, setRemData] = useRecoilState(reminderDataState);

  // SNOOZE MODAL
  const remindInRef = useRef(null);
  const [repeat, setRepeat] = useState("never");
  const [openRemTab, setOpenRemTab] = useState(false);
  useClickOut(remindInRef, () => setOpenRemTab(false));
  const [remindIn, setRemindIn] = useState("Later today");
  const [bookmarksData, setBookmarksData] = useRecoilState(bookmarksDataState);

  const [autoTrig, setAutoTrig] = useState(false);

  // FUNCTIONS
  const openLink = () => {
    closeToast();
    window.open(item?.link, "_blank");
  };

  const isToday = (activeDate = dateVal) =>
    activeDate.getDate() === new Date().getDate() &&
    activeDate.getMonth() === new Date().getMonth();

  const closeToast = async () => {
    const newList = remData.filter((i: any) => i.id !== item.id);

    chrome.runtime.sendMessage(
      { type: "dismiss-toast", item },
      function (response) {
        var error = chrome.runtime.lastError;
        if (error) return;
      }
    );

    setRemData(newList);
  };

  const snoozeReminder = async () => {
    const dateCheck = new Date();
    const newList = bookmarksData.map((rem: any) => {
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
    closeToast();
  };

  const onRemindInChange = (option: string) => {
    if (option === "custom") {
      setRemindIn(option);
      return;
    }
    const newDate = getReminderTimer(option);
    setDateVal(newDate);
    setRemindIn(option);
    setOpenRemTab(false);
  };

  const onSetCustom = (dateVal: Date) => {
    setDateVal(dateVal);
    onRemindInChange("custom");
    setOpenRemTab(false);
  };

  return (
    <div className="yaba-notification-toast" data-overflow={openRemTab}>
      {openRemTab && (
        <ReminderModal
          {...{
            repeat,
            remindIn,
            setRepeat,
            onSetCustom,
            remindInRef,
            setOpenRemTab,
            onRemindInChange,

            autoTrig,
            setAutoTrig,
            onscreen: true,
            showSubmitBtn: false,
          }}
        />
      )}

      <div className="yaba-toast__header">
        <div className="yaba-toast__header-block">
          <Timer size={14.4} weight="bold" />
          <p>Reminder</p>
        </div>
        <div className="yaba-toast__header-time">
          {dayjs(item?.date).format("h:mm A")}
        </div>
      </div>

      <div className="yaba-toast__link-details">
        <div className="yaba-toast__link-details__media" onClick={openLink}>
          <div className="yaba-toast__link-details__media-image-cover">
            <img
              onLoad={e => setImgLoaded(true)}
              src={item?.thumbnail || getPlaceholder()}
            />
            {!imgLoaded ? (
              <div className="yaba-toast__link-details__media-image-cover__placeholder">
                <img src={getPlaceholder()} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="yaba-toast__link-details__content">
          <p className="yaba-toast__link-details__content-title">
            {item?.title}
          </p>

          <div className="yaba-toast__link-details__content__reminder-dets">
            <div
              className="yaba-toast__link-details__content__reminder-dets__bkmk-link"
              onClick={openLink}
            >
              <p>{item?.link ? new URL(item.link).host : null}</p>
            </div>

            <div className="yaba-toast__link-details__content__reminder-dets__action-btns">
              <button className="yaba-toast__dismiss-btn" onClick={closeToast}>
                Dismiss
              </button>
              {item?.toastType !== "welcome" && (
                <button
                  className="yaba-toast__snooze-btn"
                  onClick={e => {
                    if (openSnooze) {
                      setOpenSnooze(false);
                      setDateVal(new Date());
                    } else {
                      onRemindInChange(remindIn);
                      setOpenSnooze(true);
                    }
                  }}
                >
                  Snooze
                </button>
              )}
            </div>
          </div>
        </div>

        {openSnooze ? (
          <div className="yaba-toast__reminder-config">
            <div className="yaba-toast__reminder-config-label">
              Snooze this reminder
            </div>

            <div className="yaba-toast__reminder-block" data-open={openSnooze}>
              <div className="yaba-toast__reminder-block__row">
                <div className="yaba-toast__reminder-block__row-title">
                  <Icons.alarmBell />
                  <p>{`Remind me ${remindIn !== "custom" ? "" : "by"}`}</p>
                </div>

                <button
                  onClick={e => setOpenRemTab(true)}
                  className="yaba-toast__reminder-block__row-btn"
                >
                  <p>
                    {remindIn !== "custom"
                      ? remindIn
                      : dayjs(dateVal).format(
                          isToday() ? "hh:mm A" : "DD MMM, YYYY"
                        )}
                  </p>
                  <Icons.caretdown />
                </button>
              </div>

              <div className="yaba-toast__reminder-block__row tab">
                <div className="yaba-toast__reminder-block__row-title">
                  <Icons.external />
                  <p>Open in new tab</p>
                </div>

                <button
                  className="base-switch"
                  data-move={autoTrig}
                  onClick={() => {
                    setAutoTrig(p => !p);
                  }}
                >
                  <div className="base-switch-toggle" />
                </button>
              </div>
            </div>

            <button
              onClick={snoozeReminder}
              className="yaba-toast__reminder-config__snooze-btn"
            >
              Snooze
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppToast;
