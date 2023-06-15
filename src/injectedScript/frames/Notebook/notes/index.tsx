import { Outlet } from "react-router-dom";

const Notes = () => {
  return (
    <div className="yaba-notebook__notes">
      <Outlet />
    </div>
  );
};

export default Notes;
