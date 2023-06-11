import Icons from "../../../common/Icons";

const ContactsHeader = ({ setScreen, navTo, setNavTo }) => {
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
      <div className="screen-title no-margin">Contacts</div>
      <div className="action-btns"></div>
    </div>
  );
};

export default ContactsHeader;
