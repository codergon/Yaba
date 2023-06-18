import { useRef, useState } from "react";
import Icons from "../../common/Icons";
import { useClickOut } from "../../hooks/useClickOut";
import RemInputScreen from "./RemInputScreen";
import Repeat from "./Repeat";
import SelectScreen from "./SelectScreen";

const ReminderModal = ({
  repeat,
  remindIn,
  setRepeat,
  onSetCustom,
  setOpenRemTab,
  onRemindInChange,

  onscreen,
  autoTrig,
  setAutoTrig,
  showSubmitBtn = true,
}) => {
  const modalRef = useRef(null);
  const [screen, setScreen] = useState("select");
  useClickOut(modalRef, () => setOpenRemTab(false));

  const handleScreen = () => {
    if (screen === "remInput") {
      setScreen("select");
    }
    if (screen === "repeat") {
      setScreen("remInput");
    }
  };

  return (
    <div className={`yaba-app-modal ${onscreen && "onscreen"}`}>
      <div
        className={`yaba-app-modal-content ${onscreen && "onscreen"}`}
        ref={modalRef}
      >
        <div className="yaba-app-modal-content-header">
          <button data-active={screen !== "select"} onClick={handleScreen}>
            <Icons.arrowLeft />
          </button>
          <p>
            {screen === "remInput"
              ? "Custom reminder"
              : screen === "repeat"
              ? "Repeat"
              : "Remind in"}
          </p>

          <button className="sm-icon" onClick={e => setOpenRemTab(false)}>
            <Icons.close />
          </button>
        </div>

        {screen === "select" ? (
          <SelectScreen
            {...{
              remindIn,
              onSetCustom,
              onRemindInChange,
              setScreen,

              autoTrig,
              setAutoTrig,
              showSubmitBtn,
            }}
          />
        ) : screen === "remInput" ? (
          <RemInputScreen
            {...{
              repeat,
              setScreen,
              onSetCustom,

              autoTrig,
              setAutoTrig,
              showSubmitBtn,
            }}
          />
        ) : screen === "repeat" ? (
          <Repeat {...{ repeat, setRepeat, setScreen }} />
        ) : null}
      </div>
    </div>
  );
};

export default ReminderModal;
