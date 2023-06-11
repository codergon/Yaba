import ForeApp from "./ForeApp";
import Frame from "react-frame-component";
import TimeAgo from "javascript-time-ago";
import { createRoot } from "react-dom/client";
import { RecoilRoot, useRecoilValue } from "recoil";
import en from "javascript-time-ago/locale/en.json";
import fr from "javascript-time-ago/locale/fr.json";
import { reminderDataState } from "./atoms/foreState";
import AuthScript from "./auth";
import Highlighter from "./Highlighter";

TimeAgo.addLocale(fr);
TimeAgo.addDefaultLocale(en);

const container = document.createElement("div");
container.id = "yaba-app-foreground";
container.style.position = "fixed";
container.style.top = "0";
container.style.right = "0";
container.style.zIndex = 10e12;

document.querySelector("body").appendChild(container);
const root = createRoot(container);

const Main = () => {
  const reminders = useRecoilValue(reminderDataState);

  return (
    <>
      {/* <Highlighter /> */}
      {/* <AuthScript /> */}

      {/* <Frame
        id="yaba-foreground-frame"
        width={reminders?.length > 0 ? "380px" : "0px"}
        height={reminders?.length > 0 ? "420px" : "0px"}
        style={{
          margin: 0,
          padding: 0,
          border: "none",
          colorScheme: "initial",
        }}
        head={[
          <link
            rel="stylesheet"
            key={"foreground"}
            href={chrome.runtime.getURL("styles/foreground.css")}
          />,
        ]}
      >
        <ForeApp />
      </Frame> */}
    </>
  );
};

root.render(
  <RecoilRoot>
    <Main tab="foreapp" />
  </RecoilRoot>
);
