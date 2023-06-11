import Icons from "../../common/Icons";
import { getReminderTimer } from "./helpers";

const SelectScreen = ({
  remindIn,
  setScreen,
  autoTrig,
  onSetCustom,
  setAutoTrig,
  showSubmitBtn,
  onRemindInChange,
}) => {
  const reminderOptions = [
    "Later today",
    "Tomorrow morning",
    "Tomorrow evening",
    "This weekend",
    "In a week",
    "In a month",
  ];

  return (
    <>
      <ul>
        {reminderOptions.map((option, index) => {
          return (
            <li
              key={index}
              className="lowercase"
              onClick={e => onRemindInChange(option)}
            >
              <p>{option}</p>
              {remindIn === option ? <Icons.done /> : null}
            </li>
          );
        })}
      </ul>

      <div className="custom-actions">
        <button className="custom-option" onClick={e => setScreen("remInput")}>
          <p>Custom</p>
          <Icons.arrowRight />
        </button>

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

      {showSubmitBtn && (
        <button
          className="set-reminder-btn"
          onClick={e => {
            if (reminderOptions.includes(remindIn)) {
              const newDate = getReminderTimer(remindIn);
              onSetCustom(newDate, newDate.getHours(), newDate.getMinutes());
            }
          }}
        >
          Set reminder
        </button>
      )}
    </>
  );
};

export default SelectScreen;
