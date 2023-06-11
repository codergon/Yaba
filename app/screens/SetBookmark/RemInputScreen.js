import dayjs from "dayjs";
import Icons from "../../common/Icons";
import { doubleDigit } from "./helpers";
import { useRef, useState } from "react";
import { Calendar } from "react-calendar";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { useClickOut } from "../../hooks/useClickOut";

const RemInputScreen = ({
  repeat,
  setScreen,
  onSetCustom,

  autoTrig,
  setAutoTrig,
  showSubmitBtn,
}) => {
  const [dateVal, setDateVal] = useState(new Date());
  const [hour, setHour] = useState(doubleDigit(new Date().getHours()));
  const [minute, setMinute] = useState(doubleDigit(new Date().getMinutes()));

  const calendarRef = useRef(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  useClickOut(calendarRef, () => setOpenCalendar(false));

  const isToday = (activeDate = dateVal) =>
    activeDate.getDate() === new Date().getDate() &&
    activeDate.getMonth() === new Date().getMonth();

  const handleHourChange = value => {
    if (isNaN(value) || Number(value) > 23) return;
    const newDate = dateVal;

    if (isToday()) {
      const present = new Date();
      const hr =
        Number(value) < present.getHours() ? present.getHours() : value;
      const min =
        Number(minute) < present.getMinutes()
          ? Number(present.getMinutes())
          : minute;
      newDate.setHours(Number(hr));
      newDate.setMinutes(Number(min));

      setDateVal(newDate);
      setHour(doubleDigit(hr));
      setMinute(doubleDigit(min));
    } else {
      newDate.setHours(Number(value));
      setDateVal(newDate);
      setHour(doubleDigit(value));
    }
  };
  const handleMinChange = value => {
    if (isNaN(value) || Number(value) > 59) return;
    const newDate = dateVal;

    if (isToday()) {
      const present = new Date();
      const hr = Number(hour) < present.getHours() ? present.getHours() : hour;
      const min =
        Number(hour) <= present.getHours() &&
        Number(value) < present.getMinutes()
          ? present.getMinutes()
          : value;
      newDate.setHours(Number(hr));
      newDate.setMinutes(Number(min));

      setDateVal(newDate);
      setHour(doubleDigit(hr));
      setMinute(doubleDigit(min));
    } else {
      newDate.setMinutes(Number(value));
      setDateVal(newDate);
      setMinute(doubleDigit(value));
    }
  };
  const handleDateChange = date => {
    if (isNaN(date?.getTime())) return;

    if (isToday(date)) {
      const present = new Date();
      const hr = Number(hour) < present.getHours() ? present.getHours() : hour;
      const min =
        Number(minute) < present.getMinutes()
          ? Number(present.getMinutes())
          : minute;
      setHour(doubleDigit(hr));
      setMinute(doubleDigit(min));
      date.setHours(Number(hr));
      date.setMinutes(Number(min));
      setDateVal(date);
      setOpenCalendar(false);
    } else {
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      setDateVal(date);
      setOpenCalendar(false);
    }
  };

  return (
    <>
      <div className="reminder-options">
        {openCalendar ? (
          <div ref={calendarRef} className="calendar-popup">
            <Calendar
              minDetail="year"
              value={dateVal}
              minDate={new Date()}
              tileClassName={({ activeStartDate, date, view }) =>
                view === "month" && date.getDay() === dateVal.getDay()
                  ? "active-tile"
                  : null
              }
              onChange={handleDateChange}
            />
          </div>
        ) : null}

        <div className="option">
          <div className="option-title">
            <Icons.calendar />
            <p>Date</p>
          </div>

          <div className="option-configs">
            <button
              className="option-select"
              onClick={e => setOpenCalendar(p => true)}
            >
              <p>{dayjs(dateVal).format("DD MMM, YYYY")}</p>
              <Icons.caretdown elemClass={"stroke"} />
            </button>
          </div>
        </div>

        <div className="option">
          <div className="option-title">
            <Icons.clock />
            <p>Time</p>
          </div>

          <div className="option-configs">
            <div className="option-select time-option">
              <input
                min={0}
                max={23}
                type="number"
                value={hour}
                onBlur={e => handleHourChange(e.target.value)}
                onChange={e =>
                  e.target.value.length < 3 &&
                  setHour(
                    e.target.value > 23
                      ? 23
                      : e.target.value < 0
                      ? 0
                      : e.target.value
                  )
                }
              />
              <Menu
                menuButton={
                  <button>
                    <Icons.caretdown elemClass={"stroke"} />
                  </button>
                }
                align="end"
                transition
                direction="top"
                offsetY={-20}
                offsetX={5}
                unmountOnClose={true}
                onItemClick={e => handleHourChange(e.value)}
                menuClassName="time-picker"
              >
                {[...Array(24).keys()].map(i => (
                  <MenuItem key={i} value={i} className="time-picker-item">
                    <p>{`${i >= 10 ? i : "0" + i}`}</p>
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <div className="option-select time-option">
              <input
                min={0}
                max={59}
                type="number"
                value={minute}
                onBlur={e => handleMinChange(e.target.value)}
                onChange={e =>
                  e.target.value.length < 3 &&
                  setMinute(
                    e.target.value > 59
                      ? 59
                      : e.target.value < 0
                      ? 0
                      : e.target.value
                  )
                }
              />
              <Menu
                menuButton={
                  <button>
                    <Icons.caretdown elemClass={"stroke"} />
                  </button>
                }
                align="end"
                transition
                direction="top"
                offsetY={-20}
                offsetX={5}
                onItemClick={e => handleMinChange(e.value)}
                menuClassName="time-picker"
              >
                {[...Array(60).keys()].map(i => (
                  <MenuItem key={i} value={i} className="time-picker-item">
                    <p>{`${i >= 10 ? i : "0" + i}`}</p>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      </div>

      <div className="repeat-options">
        <div className="option">
          <div className="option-title">
            <Icons.repeat />
            <p>Repeat</p>
          </div>

          <button className="option-select" onClick={e => setScreen("repeat")}>
            <p>{repeat}</p>
          </button>
        </div>

        {showSubmitBtn && (
          <div className="spaced-block tab">
            <div className="spaced-block-title">
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
        )}
      </div>

      <button
        className="set-reminder-btn"
        onClick={e => onSetCustom(dateVal, hour, minute)}
      >
        Set reminder
      </button>
    </>
  );
};

export default RemInputScreen;
