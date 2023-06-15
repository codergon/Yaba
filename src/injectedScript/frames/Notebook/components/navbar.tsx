import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigation = useNavigate();

  const [lastActivePath, setLastActivePath] = useState("");

  const handleHomeClick = () => {
    if (location.pathname === "/tasks") {
      navigation(-1);
    } else if (lastActivePath === "/editor") {
      navigation("/editor");
    } else {
      navigation("/");
    }
  };

  const handleTasksClick = () => {
    navigation("/tasks");
  };

  useEffect(() => {
    setLastActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="yaba-notebook__navbar">
      <div className="yaba-notebook__navbar-inner">
        <button
          data-active={
            location.pathname === "/" || location.pathname === "/editor"
          }
          onClick={handleHomeClick}
        >
          Home
        </button>
        <button
          data-active={location.pathname === "/tasks"}
          onClick={handleTasksClick}
        >
          Tasks
        </button>
      </div>
    </div>
  );
};

export default Navbar;
