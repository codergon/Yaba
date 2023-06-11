import "./splash.scss";
import Slides from "./Slides";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSetRecoilState } from "recoil";
import BgIllustration from "./BgIllustration";
import { isLoggedInState } from "../../atoms/appState";
import { AuthSignIn } from "../../store/user/userSlice";

const Splash = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("splash");
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const handleAuth = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      await chrome.runtime
        .sendMessage({ type: "login" })
        .then(async response => {
          if (response?.error) {
            setIsLoggedIn(false);
            setError(response?.error);
            return;
          } else {
            dispatch(
              AuthSignIn(response?.user?.user, response?.user?.userContacts)
            );
            setIsLoggedIn(true);
            return;
          }
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="page-content splash-screen">
      {screen === "splash" ? (
        <BgIllustration nextpage={() => setScreen("slides")} />
      ) : (
        <Slides loading={loading} error={error} handleAuth={handleAuth} />
      )}
    </div>
  );
};

export default Splash;
