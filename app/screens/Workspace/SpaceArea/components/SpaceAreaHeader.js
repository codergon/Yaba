import Icons from "../../../../common/Icons";
import { useNavigate } from "react-router-dom";

const SpaceAreaHeader = () => {
  let navigate = useNavigate();

  return (
    <div className="ext-header" data-underline={true}>
      <button className="back-btn" onClick={e => navigate(-1)}>
        <Icons.arrowLeft />
      </button>

      <div className="screen-title no-margin">Workspace</div>

      <div className="action-btns">
        <button className="close-ext" onClick={e => window.close()}>
          <Icons.close />
        </button>
      </div>
    </div>
  );
};

export default SpaceAreaHeader;
