import "./splash.scss";
import Slides from "./Slides";
import { useState } from "react";
import BgIllustration from "./BgIllustration";
import { AUTH_URL } from "../../utils/constants";

const Splash = () => {
  const [screen, setScreen] = useState("splash");

  const handleAuth = async () => {
    window.open(AUTH_URL, "_blank");
  };

  return (
    <div className="page-content splash-screen">
      {screen === "splash" ? (
        <BgIllustration nextpage={() => setScreen("slides")} />
      ) : (
        <Slides handleAuth={handleAuth} />
      )}
    </div>
  );
};

export default Splash;
