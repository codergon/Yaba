import "./browsingHistory.scss";
import Header from "../../layout/Header";
import History from "./components/History";
import SearchBar from "./components/SearchBar";
import { FadersHorizontal } from "phosphor-react";
import HistoryFilters from "./components/filters";
import { useAppStore } from "../../context/AppContext";

const BrowsingHistory = () => {
  const { setOpenFilters } = useAppStore();

  return (
    <>
      <Header label="History" tabs={true} />

      <div
        className="base-tabs"
        style={{
          // height: "496px",
          overflow: "hidden",
        }}
      >
        <HistoryFilters />

        <div className="base-tabs__configs">
          <div className="base-tabs__actions">
            <div className="search-bar">
              <SearchBar />
            </div>

            <div className="block">
              <button onClick={() => setOpenFilters(true)}>
                <FadersHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="base-tabs__content no-padding"
          style={{
            overflowY: "scroll",
          }}
        >
          <div className="history">
            <History />
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowsingHistory;
