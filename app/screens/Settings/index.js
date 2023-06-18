import "./settings.scss";
import { useRecoilState } from "recoil";
import { useRef, useState } from "react";
import Header from "../../layout/Header";
import Vectors from "../../common/Vectors";
import Categories from "../SetBookmark/Categories";
import { useClickOut } from "../../hooks/useClickOut";
import { ChevronDown, ExternalLink } from "lucide-react";
import { UserState, categoriesDataState } from "../../atoms/appState";

const Settings = () => {
  const [user, setUser] = useRecoilState(UserState);

  const signOut = async () => {
    setUser(null);
    await chrome.storage.local.remove("userContacts");
    await chrome.runtime.sendMessage({ type: "refresh-pages-auth" });
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
                    <p className="sub">{user?.email}</p>
                  </div>
                </div>
              </div>
            </>
          </div>

          <div className="preferences">
            <div className="category">
              <div className="category-header">
                <p className="title">Options</p>
              </div>
              <ul>
                {categoriesData?.length > 0 && (
                  <li
                    onClick={() => setOpenCategories(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="item-key">
                      <p className="main">Delete Categories</p>
                    </div>
                    <ChevronDown size={13} strokeWidth={3} />
                  </li>
                )}

                <li>
                  <div className="item-key">
                    <p className="main">Privacy Policy</p>
                  </div>
                  <button
                    className="external-link"
                    onClick={() =>
                      window.open(
                        "https://getyaba-privacy.netlify.app",
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink size={13} strokeWidth={3} />
                  </button>
                </li>
              </ul>
            </div>

            <div className="category">
              <div className="category-header">
                <p className="title">Shortcuts</p>
              </div>
              <ul>
                <li>
                  <div className="item-key">
                    <p className="main colored">⌘ / Ctrl + E </p>
                    <p className="sub">Open Yaba extension</p>
                  </div>
                </li>

                <li>
                  <div className="item-key">
                    <p className="main colored">⌘ / Ctrl + B</p>
                    <p className="sub">
                      Toggle <span>Notebook</span> visibility
                    </p>
                  </div>
                </li>
                <li>
                  <div className="item-key">
                    <p className="main colored">⌘ / Ctrl + U</p>
                    <p className="sub">Bookmark the current tab</p>
                  </div>
                </li>
              </ul>

              <button className="sign-out" onClick={signOut}>
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
