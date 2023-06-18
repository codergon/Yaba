import Icons from "../common/Icons";
import { useNavigate } from "react-router-dom";

const Header = ({ label, title, tabs = false }) => {
  let navigate = useNavigate();

  return (
    <div className="ext-header" data-underline={!!tabs}>
      {!label ? (
        <button className="back-btn" onClick={e => navigate(-1)}>
          <Icons.arrowLeft />
        </button>
      ) : (
        <div className="screen-label">
          <p>{label}</p>
        </div>
      )}

      {title ? <div className="screen-title">{title}</div> : null}

      <div className="action-btns">
        <button className="close-ext" onClick={e => window.close()}>
          <Icons.close size={14} />
        </button>
      </div>
    </div>
  );
};

export default Header;
