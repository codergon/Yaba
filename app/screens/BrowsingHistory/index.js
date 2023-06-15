import "./browsingHistory.scss";
import Header from "../../layout/Header";
import History from "./components/History";
import SearchBar from "./components/SearchBar";
import { FadersHorizontal } from "phosphor-react";
import HistoryFilters from "./components/filters";
import { useAppStore } from "../../context/AppContext";
import Icons from "../../common/Icons";
import { X } from "lucide-react";
import dayjs from "dayjs";

const BrowsingHistory = () => {
  const {
    toDate,
    useDate,
    fromDate,
    checklist,
    openFilters,
    queryHistory,
    orderByVisits,
    setOpenFilters,
    setOrderByVisits,
    removeFromChecklist,
  } = useAppStore();

  return (
    <>
      <Header label="History" tabs={true} />

      <div className="base-tabs no-overflow">
        {openFilters && <HistoryFilters />}

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

        {(useDate || orderByVisits || checklist.length > 0) && (
          <div className="history-filters">
            <div className="history-filters__content">
              {useDate && (
                <button
                  className="checklist-item"
                  onClick={async _ => await queryHistory(false)}
                >
                  <p>
                    {toDate && fromDate ? (
                      <>
                        {dayjs(toDate).format("DD/MM/YY") +
                          " - " +
                          dayjs(fromDate).format("DD/MM/YY")}
                      </>
                    ) : (
                      <></>
                    )}
                  </p>
                  <X size={10} strokeWidth={2.6} />
                </button>
              )}

              {orderByVisits && (
                <button
                  className="checklist-item"
                  onClick={e => setOrderByVisits(false)}
                >
                  <p>Order by Visits</p>
                  <X size={10} strokeWidth={2.6} />
                </button>
              )}

              {checklist?.map((url, index) => {
                return (
                  <button
                    key={index}
                    className="checklist-item"
                    onClick={e => removeFromChecklist(url)}
                  >
                    <p>{url}</p>
                    <X size={10} strokeWidth={2.6} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
