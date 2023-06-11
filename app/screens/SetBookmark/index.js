import dayjs from "dayjs";
import { useRef } from "react";
import Icons from "../../common/Icons";
import Header from "../../layout/Header";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import "../../styles/screens/addbookmark.scss";
import { useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { useClickOut } from "../../hooks/useClickOut";
import TextareaAutosize from "react-textarea-autosize";
import { bookmarksDataState } from "../../atoms/appState";

import Repeat from "./Repeat";
import Categories from "./Categories";
import ReminderModal from "./ReminderModal";
import {
  debounceFn,
  doubleDigit,
  fetchMetadata,
  getReminderTimer,
} from "./helpers";

const AddBookmark = () => {
  let navigate = useNavigate();
  const repeatRef = useRef(null);
  const categoriesRef = useRef(null);
  // Metadata states
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [metas, setMetas] = useState(null);
  const [pageUrl, setPageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [currTitle, setCurrTitle] = useState("");
  const [currMetas, setCurrMetas] = useState(null);
  const [urlDescription, setUrlDescription] = useState("");
  // Reminder states
  const [repeat, setRepeat] = useState("never");
  const [openRepeat, setOpenRepeat] = useState(false);
  const [dateVal, setDateVal] = useState(new Date());
  const [hour, setHour] = useState(doubleDigit(new Date().getHours()));
  const [minute, setMinute] = useState(doubleDigit(new Date().getMinutes()));

  const [bookmarksData, setBookmarksData] = useRecoilState(bookmarksDataState);

  useClickOut(repeatRef, () => setOpenRepeat(false));
  useClickOut(categoriesRef, () => setOpenCategories(false));

  useEffect(() => {
    const delayDebounceFn = debounceFn(
      link,
      pageUrl,
      setTitle,
      setMetas,
      currMetas,
      currTitle,
      setLoading,
      setUrlDescription
    );
    return () => clearTimeout(delayDebounceFn);
  }, [link]);

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs &&
      chrome.tabs.query(queryInfo, tabs => {
        setLink(tabs[0]?.url);
        setPageUrl(tabs[0]?.url);
        setTitle(tabs[0]?.title);
        setCurrTitle(tabs[0]?.title);
        if (tabs[0]?.id)
          fetchMetadata(tabs[0].id, setCurrMetas, setMetas, setUrlDescription);
      });
  }, []);

  const isToday = (activeDate = dateVal) =>
    activeDate.getDate() === new Date().getDate() &&
    activeDate.getMonth() === new Date().getMonth();

  // CATEGORIES
  const [categs, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const handleChange = category => {
    if (categs.includes(category)) {
      setCategories(p => p.filter(c => c !== category));
    } else {
      setCategories(p => [...p, category]);
    }
  };

  // REMINDER TAB
  const remindInRef = useRef(null);
  const [remindIn, setRemindIn] = useState("Later today");
  const [openGroup, setOpenGroup] = useState(false);
  const [openRemTab, setOpenRemTab] = useState(false);
  useClickOut(remindInRef, () => setOpenRemTab(false));

  const onRemindInChange = option => {
    if (option === "custom") {
      setRemindIn(option);
      return;
    }

    const newDate = getReminderTimer(option);

    setDateVal(newDate);
    setHour(newDate.getHours());
    setMinute(newDate.getMinutes());
    setRemindIn(option);
    setOpenRemTab(false);
  };

  // ======================

  const [openTab, setOpenTab] = useState(false);

  //SHARE REMINDER
  const shareReminder = async () => {
    if (isNaN(dateVal?.getTime()) || !title || !link) return;
    const dateCheck = new Date();

    const shareObj = {
      link,
      title,
      categories: categs,
      id: crypto.randomUUID(),
      description:
        urlDescription || metas?.og?.description || metas?.twitter?.description,
      date: Number(dateVal.getTime()),
      thumbnail: metas?.og?.image || metas?.twitter?.image,
      expired:
        isToday(dateVal) &&
        dateVal?.getHours() <= dateCheck.getHours() &&
        dateVal?.getMinutes() <= dateCheck.getMinutes(),
    };
    navigate("/share-bookmark", { state: shareObj });
  };

  // SAVE REMINDER
  const updateRemoteData = async newData => {
    setBookmarksData(newData);
  };

  //ADD REMINDER
  const addReminder = async () => {
    if (isNaN(dateVal?.getTime()) || !title || !link) return;
    const dateCheck = new Date();

    const newBookmark = {
      link,
      title,
      repeat,
      paused: false,
      shared: false,
      sharedWith: [],
      categories: categs,
      autoTrigger: openTab,
      id: crypto.randomUUID(),
      date: Number(dateVal.getTime()),
      description: urlDescription,
      thumbnail: metas?.og?.image || metas?.twitter?.image,
      expired:
        isToday(dateVal) &&
        dateVal?.getHours() <= dateCheck.getHours() &&
        dateVal?.getMinutes() <= dateCheck.getMinutes(),
    };

    const newList = bookmarksData
      ? [newBookmark, ...bookmarksData]
      : [newBookmark];

    await updateRemoteData(newList);
    navigate("/");
  };

  const onSetCustom = (dateVal, hour, minute) => {
    setHour(hour);
    setMinute(minute);
    setDateVal(dateVal);
    onRemindInChange("custom");
    setOpenRemTab(false);
  };

  return (
    <>
      <Header title="New bookmark" />

      {openCategories && (
        <Categories {...{ setCategories, categoriesRef, setOpenCategories }} />
      )}
      {openRepeat && (
        <Repeat {...{ setRepeat, setOpenRepeat, repeat, repeatRef }} />
      )}

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
            showSubmitBtn: false,
          }}
        />
      )}

      <div className="page-content add-bookmarks">
        <div className="content-block">
          <div className="link-input-cover" data-active={!!link?.trim()}>
            <TextareaAutosize
              type="text"
              minRows={1}
              value={link}
              disabled={loading}
              placeholder="Enter link/URL"
              onChange={e => setLink(e.target.value)}
            />
          </div>

          {!!link?.trim() ? (
            loading ? (
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarLoader color={"#888"} loading={true} height={5} />
              </div>
            ) : (
              <>
                <div className="bookmarks__item__contents">
                  {metas?.og?.image || metas?.twitter?.image ? (
                    <div className="media">
                      <img
                        src={metas?.twitter?.image || metas?.og?.image}
                        alt="OpenGraph Image"
                      />
                    </div>
                  ) : null}

                  <div className="details">
                    {/* <p className="title">{title}</p> */}

                    <TextareaAutosize
                      type="text"
                      minRows={1}
                      maxRows={2}
                      value={title}
                      disabled={loading}
                      placeholder="Title"
                      className="title-text"
                      onChange={e => setTitle(e.target.value)}
                    />

                    <TextareaAutosize
                      type="text"
                      minRows={1}
                      maxRows={5}
                      value={urlDescription}
                      className="description-text"
                      placeholder="Bookmark description"
                      onChange={e => setUrlDescription(e.target.value)}
                    />

                    <div className="reminder-category">
                      <button onClick={e => setOpenCategories(p => !p)}>
                        <p>Category: Tags</p>
                        <Icons.caretdown />
                      </button>

                      <ul className="selected-items">
                        {categs?.map((i, ind) => (
                          <li key={ind} onClick={e => handleChange(i)}>
                            <p>{i}</p>
                            <Icons.categoryX />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="reminder-config">
                      <div
                        className="label"
                        onClick={e => {
                          if (openGroup) {
                            setOpenGroup(false);
                            setDateVal(new Date());
                            setHour(new Date().getHours());
                            setMinute(new Date().getMinutes());

                            setOpenTab(false);
                          } else {
                            onRemindInChange(remindIn);
                            setOpenGroup(true);
                          }
                        }}
                      >
                        <p>Set a reminder</p>
                        {Icons[openGroup ? "caretup" : "caretdown"]({
                          elemClass: "stroke",
                        })}
                      </div>

                      {openGroup ? (
                        <div className="reminder-block" data-open={openGroup}>
                          <div className="remind-in">
                            <div className="remind-in-title">
                              <Icons.alarmBell />
                              <p>
                                {`Remind me ${
                                  remindIn !== "custom" ? "" : "in"
                                }`}
                              </p>
                            </div>

                            <button
                              onClick={e => setOpenRemTab(true)}
                              className="remind-in-btn"
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

                          <div className="remind-in tab">
                            <div className="remind-in-title">
                              <Icons.external />
                              <p>Open in new tab</p>
                              {/* <p>Open automatically</p> */}
                            </div>

                            <button
                              className="base-switch"
                              data-move={openTab}
                              onClick={() => {
                                setOpenTab(p => !p);
                              }}
                            >
                              <div className="base-switch-toggle" />
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="action-btns">
                  <button
                    onClick={shareReminder}
                    className="share-bookmark"
                    data-active={!!title && !!link && !loading}
                  >
                    <Icons.share />
                    <p>Share</p>
                  </button>
                  <button
                    onClick={addReminder}
                    className="create-bookmark"
                    data-active={
                      !isNaN(dateVal?.getTime()) &&
                      !!title &&
                      !!link &&
                      !loading
                    }
                  >
                    ADD BOOKMARK
                  </button>
                </div>
              </>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AddBookmark;
