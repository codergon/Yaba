import Icons from "../../../common/Icons";

const ComposeHeader = ({ setScreen, navTo, setNavTo }) => {
  return (
    <div className="ext-header">
      <button
        className="back-btn"
        onClick={e => {
          if (navTo === "compose") {
            setNavTo("");
            setScreen("compose");
          } else {
            setScreen("options");
          }
        }}
      >
        <Icons.arrowLeft />
      </button>
      <div className="screen-title">Share to workspace</div>

      <div className="action-btns">
        <button className="close-ext" onClick={e => window.close()}>
          <Icons.close />
        </button>
      </div>
    </div>
  );
};

export default ComposeHeader;
