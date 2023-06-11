import Icons from "../common/Icons";
import { useNavigate } from "react-router-dom";

const StaticButton = () => {
  let navigate = useNavigate();
  return (
    <button className="static-btn" onClick={e => navigate("create-bookmark")}>
      <Icons.plus />
    </button>
  );
};

export default StaticButton;
