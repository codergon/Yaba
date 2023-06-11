import dayjs from "dayjs";
import React from "react";
import App from "../../app/App";
import { RecoilRoot } from "recoil";
import TimeAgo from "javascript-time-ago";
import duration from "dayjs/plugin/duration";
import { createRoot } from "react-dom/client";
import en from "javascript-time-ago/locale/en.json";
import fr from "javascript-time-ago/locale/fr.json";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(duration);
dayjs.extend(advancedFormat);

TimeAgo.addLocale(fr);
TimeAgo.addDefaultLocale(en);

function init() {
  const appContainer = document.createElement("div");
  appContainer.id = "root";
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appContainer);

  root.render(
    <RecoilRoot>
      <App tab="home" />
    </RecoilRoot>
  );
}

init();
