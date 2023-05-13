import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import Tabs from "./tabs";
import "../assets/tailwind.css";

function init() {
  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appContainer);
  root.render(
    <Router>
      <Tabs />
    </Router>
  );
}

init();

//  ADD 👇🏽 to manifest.json to overide default new tab
// "chrome_url_overrides": {
//   "newtab": "newTab.html"
// }

// AND remove comments related to newtab in webpack.common.js
