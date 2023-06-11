import {
  Alarm,
  Export,
  Hash,
  Pause,
  Play,
  Trash,
  BellSimpleSlash,
  LinkSimpleHorizontal,
  Bookmark,
} from "phosphor-react";
import {
  bookmarksDataState,
  activeControlState,
  categoriesDataState,
} from "../../atoms/appState";
import dayjs from "dayjs";
import Icons from "../../common/Icons";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkReminder from "./BookmarkReminder";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { useClickOut } from "../../hooks/useClickOut";
import { useRecoilState, useRecoilValue } from "recoil";

const BookmarkItem = ({ item }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const activeControl = useRecoilValue(activeControlState);
  const [bookmarksData, setBookmarksData] = useRecoilState(bookmarksDataState);

  const deleteBookmark = () => {
    const newList = bookmarksData.filter(i => i.id !== item?.id);
    setBookmarksData(newList);
  };

  const togglePause = () => {
    const newList = bookmarksData.map(rem => {
      if (rem.id === item?.id) {
        return { ...rem, paused: !item?.paused };
      } else {
        return rem;
      }
    });
    setBookmarksData(newList);
  };

  const deleteReminder = () => {
    const newList = bookmarksData.map(rem => {
      if (rem.id === item?.id) {
        return {
          ...rem,
          paused: false,
          expired: true,
          repeat: "never",
          date: Number(new Date().getTime()),
        };
      } else {
        return rem;
      }
    });
    setBookmarksData(newList);
  };

  const shareBookmark = () => {
    navigate("/share-bookmark", { state: item });
  };

  // CATEGORIES
  const categoriesRef = useRef(null);
  const [categInput, setCategInput] = useState("");
  const [catExists, setCatExists] = useState(false);
  const [validCateg, setValidCateg] = useState(true);
  const [showCategInp, setShowCategInp] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [categoriesData, setCategoriesData] =
    useRecoilState(categoriesDataState);

  useClickOut(categoriesRef, () => setOpenCategories(false));

  const onCategoryChange = category => {
    const newList = bookmarksData.map(rem => {
      if (rem.id === item?.id) {
        return {
          ...rem,
          categories: rem?.categories.includes(category)
            ? rem.categories.filter(i => i !== category)
            : [...rem.categories, category],
        };
      } else {
        return rem;
      }
    });
    setBookmarksData(newList);
  };

  const addToCategories = () => {
    const exists = categoriesData.filter(
      cat => cat.toLowerCase() === categInput.trim().toLowerCase()
    ).length;
    if (exists > 0) {
      setCatExists(true);
      return;
    } else {
      setCatExists(false);
    }

    if (categInput.trim().length < 3) {
      setValidCateg(false);
      return;
    } else {
      setValidCateg(true);
    }

    // const newList = [...categoriesData, categInput];

    const newList = [...(categoriesData || []), categInput].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    setCategoriesData(newList);
    setShowCategInp(false);
    setCategInput("");
  };

  const [openRemTab, setOpenRemTab] = useState(false);

  // console.log(item?.date, dayjs(item?.date).format("DD MMM YYYY"));

  return activeControl === "shared" && !item?.shared ? null : (
    <>
      {openCategories ? (
        <div className="yaba-app-modal">
          <div className="yaba-app-modal-content" ref={categoriesRef}>
            <div className="yaba-app-modal-content-header">
              <button data-active={false}>
                <Icons.arrowLeft />
              </button>
              <p>Add to category</p>

              <button
                className="sm-icon"
                onClick={e => setOpenCategories(false)}
              >
                <Icons.close />
              </button>
            </div>

            {categoriesData?.length > 0 && (
              <ul>
                {categoriesData?.map((option, index) => {
                  return (
                    <li
                      key={index}
                      className="category"
                      onClick={e => onCategoryChange(option)}
                    >
                      <Icons.checkBox
                        checked={item?.categories?.includes(option)}
                      />
                      <p>{option}</p>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="add-category-container">
              <button
                className="custom-option"
                onClick={e => setShowCategInp(p => !p)}
              >
                <p>Add new category</p>
              </button>

              {showCategInp && (
                <>
                  <div className="add-category">
                    <input
                      type="text"
                      value={categInput}
                      placeholder="Input category"
                      onChange={e => setCategInput(e.target.value)}
                    />
                    <button onClick={addToCategories}>Add category</button>
                  </div>

                  {!validCateg && (
                    <p className="inValidCateg">
                      Ensure input length is min of 3 and max of 12
                    </p>
                  )}
                  {catExists && <p className="inValidCateg">Category exists</p>}
                </>
              )}
            </div>

            <button
              className="set-reminder-btn"
              onClick={e => setOpenCategories(false)}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}

      {openRemTab && (
        <BookmarkReminder {...{ item, openRemTab, setOpenRemTab }} />
      )}

      <div className="bookmarks__item">
        <div className="bookmarks__item__contents">
          <a href={item?.link} target="_blank" className="media">
            {item?.thumbnail ? (
              <div className="image-cover">
                <img
                  src={item?.thumbnail}
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
          </a>

          <div className="details">
            <div className="title-menu">
              <div className="title-desc">
                <p className="title">{item?.title}</p>
                {item?.description && (
                  <p className="description">{item?.description}</p>
                )}
              </div>

              <div className="menu-cover">
                <Menu
                  menuButton={
                    <button className="options-btn">
                      <Icons.dots />
                    </button>
                  }
                  align="end"
                  transition
                  offsetY={160}
                  className="menu-cont"
                  menuClassName="menu-container"
                >
                  <MenuItem className="menu-item" onClick={shareBookmark}>
                    <Export size={15} />
                    <p>Share</p>
                  </MenuItem>

                  {!item?.expired ? (
                    <MenuItem className="menu-item" onClick={togglePause}>
                      {item?.paused ? <Play size={13} /> : <Pause size={12} />}
                      <p>{`${item?.paused ? "Resume" : "Pause"}`}</p>
                    </MenuItem>
                  ) : null}

                  {!item?.expired ? (
                    <MenuItem className="menu-item" onClick={deleteReminder}>
                      <BellSimpleSlash size={13} />
                      <p>Cancel</p>
                    </MenuItem>
                  ) : null}

                  <MenuItem
                    className="menu-item"
                    onClick={e => setOpenCategories(p => !p)}
                  >
                    <Hash size={13} />
                    <p>Add tags</p>
                  </MenuItem>

                  {item?.expired && (
                    <MenuItem
                      className="menu-item"
                      onClick={() => setOpenRemTab(true)}
                    >
                      <Alarm size={13} />
                      <p>Set reminder</p>
                    </MenuItem>
                  )}

                  <MenuItem
                    className="menu-item delete"
                    onClick={deleteBookmark}
                  >
                    <Trash size={13} color="#bc301a" />
                    <p>Delete</p>
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {!item?.description && (
              <div className="reminder-dets alt">
                <a href={item?.link} target="_blank" className="bkmk-link">
                  <LinkSimpleHorizontal size={13} weight="bold" />
                  <p>{item?.link ? new URL(item.link).host : null}</p>
                </a>

                {!item?.expired &&
                Number(item?.date) - new Date().getTime() > 0 ? (
                  <div className="reminder-date">
                    {item?.paused ? (
                      <p>Paused</p>
                    ) : (
                      <>
                        <Icons.alarm />
                        <p>{dayjs(item?.date).format("HH:mm, MMM DD")}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="reminder-date expired">
                    <p>{dayjs(item?.date).format("MMM DD")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!!item?.description && (
          <div className="reminder-dets">
            <a href={item?.link} target="_blank" className="bkmk-link">
              <LinkSimpleHorizontal size={13} weight="bold" />
              <p>{item?.link ? new URL(item.link).host : null}</p>
            </a>

            {!item?.expired && Number(item?.date) - new Date().getTime() > 0 ? (
              <div className="reminder-date">
                {item?.paused ? (
                  <p>Paused</p>
                ) : (
                  <>
                    <Icons.alarm />
                    <p>{dayjs(item?.date).format("HH:mm, MMM DD")}</p>
                  </>
                )}
              </div>
            ) : (
              <div className="reminder-date expired">
                <p>{dayjs(item?.date).format("MMM DD")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkItem;
