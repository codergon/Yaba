import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Calendar } from "react-calendar";
import isURL from "validator/es/lib/isURL";
import Icons from "../../../../common/Icons";
import { useClickOut } from "../../../../hooks";
import { Check, Plus, X } from "phosphor-react";
import { getDomainFromURL } from "../../services/helper";
import { useAppStore } from "../../../../context/AppContext";
import {
  CalendarCheck2,
  CalendarRange,
  ListOrdered,
  SortAsc,
} from "lucide-react";
import { SortDesc } from "lucide-react";

const HistoryFilters = () => {
  const {
    toDate,
    fromDate,
    checklist,
    setToDate,
    openFilters,
    setFromDate,
    setChecklist,
    queryHistory,
    orderByVisits,
    setOpenFilters,
    setOrderByVisits,
  } = useAppStore();
  const [domain, setDomain] = useState("");
  const [isValid, setIsValid] = useState("true");
  const [useRange, setUseRange] = useState(false);
  const [useVisits, setUseVisits] = useState(false);
  const [openCalendar, setOpenCalendar] = useState("");

  const modalRef = useRef(null);
  const calendarRef = useRef(null);

  const closeFilters = (order = orderByVisits) => {
    setDomain("");
    setUseVisits(order);
    setOpenFilters(false);
  };

  useClickOut(modalRef, () => closeFilters());
  useClickOut(calendarRef, () => setOpenCalendar(""));

  const handleDateChange = date => {
    setUseRange(true);
    if (openCalendar === "from") {
      setFromDate(date);
    } else {
      setToDate(date);
      if (date < fromDate) setFromDate(date);
    }
  };

  const handleDomain = (url, action) => {
    if (checklist.includes(url) && action !== "add") {
      setChecklist(p => p.filter(c => c !== url));
    } else if (isURL(url)) {
      url = getDomainFromURL(url);
      if (!checklist.includes(url)) {
        setChecklist(p => [...p, url]);
        setDomain("");
        setIsValid("valid");
      } else {
        setIsValid("exists");
      }
    } else {
      setIsValid("invalid");
    }
  };

  const updateFilters = async () => {
    await queryHistory(useRange);
    setOrderByVisits(useVisits);
    closeFilters(useVisits);
  };

  return (
    openFilters && (
      <>
        <div className={`yaba-app-modal`}>
          <div className={`yaba-app-modal-content`} ref={modalRef}>
            <div className="yaba-app-modal-content-header">
              <p>Filter result</p>

              <button className="sm-icon" onClick={e => closeFilters()}>
                <Icons.close />
              </button>
            </div>

            <>
              <div
                className="tag-input"
                style={{
                  marginBottom: "16px",
                }}
              >
                <input
                  type="text"
                  value={domain}
                  disabled={checklist.length === 3}
                  onKeyUp={e => {
                    if (e.key === "Enter") {
                      handleDomain(domain, "add");
                    }
                  }}
                  onChange={e => {
                    if (isValid !== "valid") setIsValid("valid");
                    setDomain(e.target.value);
                  }}
                  placeholder={
                    checklist.length === 3
                      ? "Max 3 domains allowed"
                      : "Eg. twitter.com, instagram.com"
                  }
                />

                <button
                  className={`add-button ${isValid}`}
                  onClick={e => {
                    handleDomain(domain, "add");
                  }}
                >
                  {isValid === "valid" ? (
                    <Plus size={14} weight="bold" />
                  ) : isValid === "exists" ? (
                    <Check size={14} weight="bold" />
                  ) : (
                    <X size={14} weight="bold" />
                  )}
                </button>
              </div>

              {checklist?.length > 0 && (
                <div className="suggestions">
                  {checklist.map((url, index) => {
                    return (
                      <div key={index} className="suggestions-item">
                        <p>{url}</p>
                        <button
                          className="close-btn"
                          onClick={e => handleDomain(url)}
                        >
                          <div className="icon-cover">
                            <Icons.close size={6} />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="reminder-options">
                {(openCalendar === "from" || openCalendar === "to") && (
                  <div ref={calendarRef} className="calendar-popup">
                    <Calendar
                      minDetail="year"
                      value={openCalendar === "from" ? fromDate : toDate}
                      maxDate={openCalendar === "from" ? toDate : new Date()}
                      tileClassName={({ date, view }) =>
                        view === "month" &&
                        date.getDay() ===
                          (openCalendar === "from" ? fromDate : toDate).getDay()
                          ? "active-tile"
                          : null
                      }
                      onChange={handleDateChange}
                    />
                  </div>
                )}

                <div className="option">
                  <div className="option-title">
                    <CalendarRange className="normal" />
                    <p>From</p>
                  </div>

                  <div className="option-configs">
                    <button
                      className="option-select"
                      onClick={e => setOpenCalendar("from")}
                    >
                      <p className={!useRange ? "inactive" : ""}>
                        {!useRange
                          ? "DD MMM, YY"
                          : dayjs(fromDate).format("DD MMMM, YYYY")}
                      </p>
                      <Icons.caretdown elemClass={"stroke"} />
                    </button>
                  </div>
                </div>

                <div className="option">
                  <div className="option-title">
                    <CalendarCheck2 className="normal" />
                    <p>To</p>
                  </div>

                  <div className="option-configs">
                    <button
                      className="option-select"
                      onClick={e => setOpenCalendar("to")}
                    >
                      <p className={!useRange ? "inactive" : ""}>
                        {!useRange
                          ? "DD MMM, YY"
                          : dayjs(toDate).format("DD MMMM, YYYY")}
                      </p>
                      <Icons.caretdown elemClass={"stroke"} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="repeat-options">
                <div className="spaced-block">
                  <div className="spaced-block-title">
                    <SortDesc className="normal" />
                    <p>Order by number of visits</p>
                  </div>

                  <button
                    className="base-switch"
                    data-move={useVisits}
                    onClick={() => {
                      setUseVisits(p => !p);
                    }}
                  >
                    <div className="base-switch-toggle" />
                  </button>
                </div>
              </div>

              <button className="set-reminder-btn" onClick={updateFilters}>
                Use filters
              </button>
            </>
          </div>
        </div>
      </>
    )
  );
};

export default HistoryFilters;
