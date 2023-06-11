import "./settings.scss";
import Header from "../../layout/Header";
import Vectors from "../../common/Vectors";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  prefsState,
  isLoggedInState,
  userIdState,
  UserState,
  categoriesDataState,
} from "../../atoms/appState";
import Categories from "../SetBookmark/Categories";
import { useRef, useState } from "react";
import { useClickOut } from "../../hooks/useClickOut";
import { useSelector } from "react-redux";

const Settings = () => {
  const userId = useRecoilValue(userIdState);
  const [prefs, setPrefs] = useRecoilState(prefsState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const [user, setUser] = useRecoilState(UserState);

  const handleClick = async () => {
    await chrome.runtime.sendMessage({ type: "logout" }).then(response => {
      setIsLoggedIn(false);
      setUser(null);
    });
  };

  const toggleSwitch = option => {
    if (option === "fixed-btn") {
      setPrefs({ ...prefs, isFixed: !prefs?.isFixed });
    }
    if (option === "cmd-open") {
      setPrefs({ ...prefs, cmdOpen: !prefs?.cmdOpen });
    }
    if (option === "cmd-mark") {
      setPrefs({ ...prefs, cmdMark: !prefs?.cmdMark });
    }
  };

  // DELETE CATEGORIES
  const categoriesRef = useRef(null);
  useClickOut(categoriesRef, () => setOpenCategories(false));
  const [openCategories, setOpenCategories] = useState(false);
  const [categoriesData, setCategoriesData] =
    useRecoilState(categoriesDataState);

  const setCategories = async selected => {
    const newList = categoriesData.filter(
      (item, _i) => !selected.includes(item)
    );
    setCategoriesData(newList);
  };

  return (
    <>
      <Header label="Settings" />

      {openCategories && (
        <Categories
          {...{
            setCategories,
            categoriesRef,
            setOpenCategories,
            showInput: false,
            label: "Delete Categories",
          }}
        />
      )}

      <div className="base-tabs">
        <div className="settings-tab">
          <div className="user-profile">
            <>
              <div className="auth-block">
                <div className="details">
                  <div className="img-cover">
                    {user?.photoURL ? (
                      <img src={user?.photoURL} alt="user avatar" />
                    ) : (
                      <Vectors.user />
                    )}
                  </div>
                  <div className="username">
                    <div className="main">
                      <p>{user?.name || "Yaba share Id"}</p>
                    </div>
                    <p className="sub">{user?.email || userId}</p>
                  </div>
                </div>
              </div>
            </>
          </div>

          <div className="preferences">
            {/* <p className="label">Preferences</p> */}

            {categoriesData?.length > 0 && (
              <div className="category">
                <div className="category-header">
                  <p className="title">Configs</p>
                </div>
                <ul>
                  <li
                    onClick={() => setOpenCategories(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="item-key">
                      <p className="main">Delete categories</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* <div className="category">
              <div className="category-header">
                <p className="title">Accessibility</p>
              </div>
              <ul>
                <li>
                  <div className="item-key">
                    <p className="main">Show Yaba button on pages</p>
                  </div>
                  <button
                    className="base-switch"
                    data-move={prefs?.isFixed}
                    onClick={() => toggleSwitch("fixed-btn")}
                  >
                    <div className="base-switch-toggle" />
                  </button>
                </li>
              </ul>
            </div> */}

            <div className="category">
              <div className="category-header">
                <p className="title">Shortcuts</p>
              </div>
              <ul>
                <li>
                  <div className="item-key">
                    <p className="main colored">⌘E</p>
                    <p className="sub">Open browser extension</p>
                  </div>

                  {/* <button
                    className="base-switch"
                    data-move={prefs?.cmdOpen}
                    onClick={() => toggleSwitch("cmd-open")}
                  >
                    <div className="base-switch-toggle" />
                  </button> */}
                </li>

                {/* <li>
                  <div className="item-key">
                    <p className="main colored">⌘M</p>
                    <p className="sub">Annotate and share pages</p>
                  </div> */}

                {/* <button
                    className="base-switch"
                    data-move={prefs?.cmdMark}
                    onClick={() => toggleSwitch("cmd-mark")}
                  >
                    <div className="base-switch-toggle" />
                  </button> */}
                {/* </li> */}

                {/* <li>
                  <div className="item-key">
                    <p className="main colored">⌘U</p>
                    <p className="sub">Open extension in fullscreen</p>
                  </div>
                </li> */}
              </ul>

              <button className="sign-out" onClick={handleClick}>
                <p className="main">Sign out</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
