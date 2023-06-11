import _ from "lodash";
import "./bookmarks.scss";
import Bookmark from "./Bookmark";
import Workspace from "../Workspace";
import { useRecoilState } from "recoil";
import Header from "../../layout/Header";
import { Menu, MenuItem } from "@szhsin/react-menu";
import {
  groupByState,
  searchBmkState,
  activeControlState,
  searchSpaceItems,
} from "../../atoms/appState";
import { ListFilter } from "lucide-react";

const Bookmarks = () => {
  const [search, setSearch] = useRecoilState(searchBmkState);
  const [groupItemsBy, setGroupBy] = useRecoilState(groupByState);
  const [spaceSearch, setSpaceSearch] = useRecoilState(searchSpaceItems);
  const [activeControl, setActiveControl] = useRecoilState(activeControlState);

  return (
    <>
      <Header label="Yaba" tabs={true} />

      <div className="base-tabs">
        <div className="base-tabs__configs">
          <div className="base-tabs__controls">
            <div
              className="active-highlight"
              data-move={activeControl === "workspace"}
            />
            <button
              className="base-tabs__controls__btn"
              onClick={e => setActiveControl("bookmarks")}
            >
              Bookmarks
            </button>
            <button
              className="base-tabs__controls__btn"
              onClick={e => setActiveControl("workspace")}
            >
              Workspace
            </button>
          </div>

          <div className="base-tabs__actions">
            <div className="search-bar">
              <input
                type="text"
                value={activeControl === "workspace" ? spaceSearch : search}
                className="search-bar-input"
                placeholder={`Search ${
                  activeControl === "workspace" ? "workspaces" : "bookmarks"
                }`}
                onChange={e =>
                  (activeControl === "workspace" ? setSpaceSearch : setSearch)(
                    e.target.value
                  )
                }
              />
            </div>

            {activeControl === "bookmarks" && (
              <div>
                <Menu
                  menuButton={
                    <div className="block">
                      <button>
                        <ListFilter size={18} />
                      </button>
                    </div>
                  }
                  align="end"
                  transition
                  menuClassName="filter-menu"
                  onItemClick={e => setGroupBy(e.value)}
                >
                  {["all", "date", "category", "status"].map((slug, ind) => (
                    <MenuItem
                      data-active={slug === groupItemsBy}
                      value={slug}
                      key={ind}
                      className="menu-item"
                    >
                      <p>{slug}</p>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}
          </div>
        </div>

        <div className="base-tabs__content">
          {activeControl === "bookmarks" ? <Bookmark /> : <Workspace />}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
