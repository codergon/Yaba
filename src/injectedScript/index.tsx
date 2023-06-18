import Auth from "./auth";
import { useState } from "react";
import { RecoilRoot } from "recoil";
import Foreground from "./Foreground";
import Frame from "react-frame-component";
import TimeAgo from "javascript-time-ago";
import { createRoot } from "react-dom/client";
import en from "javascript-time-ago/locale/en.json";
import fr from "javascript-time-ago/locale/fr.json";

export const AUTH_URL = "https://getyaba.vercel.app/auth";

TimeAgo.addLocale(fr);
TimeAgo.addDefaultLocale(en);

interface ComponentProps {
  id: string;
  top?: string;
  left?: string;
  right?: string;
  zIndex?: number;
  bottom?: string;
  translate?: string;
}

const init = (components: ComponentProps[]) => {
  const containers: HTMLDivElement[] = [];
  components.forEach(component => {
    const container = document.createElement("div");
    container.id = component.id;
    container.style.position = "fixed";
    container.style.zIndex = component.zIndex?.toString() || (10e12).toString();
    if (component.top) container.style.top = component.top;
    if (component.left) container.style.left = component.left;
    if (component.right) container.style.right = component.right;
    if (component.bottom) container.style.bottom = component.bottom;
    if (component.translate) container.style.transform = component.translate;

    document.querySelector("body")?.appendChild(container);
    containers.push(container);
  });

  return containers;
};

const [container, notesContainer] = init([
  {
    top: "0px",
    right: "0px",
    id: "yaba-app-foreground",
  },
  {
    right: "0px",
    bottom: "0px",
    zIndex: 10e13,
    id: "yaba-app-notebook",
  },
]);
const root = createRoot(container);
const notesRoot = createRoot(notesContainer);

const MainRoot = () => {
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);

  return (
    <>
      <Frame
        id="yaba-foreground-frame"
        width={frameWidth + "px"}
        height={frameHeight + "px"}
        style={{
          margin: 0,
          padding: 0,
          top: "20px",
          right: "24px",
          border: "none",
          borderRadius: "6px",
          colorScheme: "none",
          position: "relative",
        }}
        head={[
          <meta key={"foreground-charSet"} charSet="utf-8" />,
          <link
            rel="stylesheet"
            key={"foreground-css"}
            href={chrome.runtime.getURL("styles/foreground.css")}
          />,
        ]}
      >
        <Foreground
          isNotes={false}
          setFrameWidth={setFrameWidth}
          setFrameHeight={setFrameHeight}
        />
      </Frame>
    </>
  );
};

const NotesRoot = () => {
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);

  return (
    <>
      <Frame
        id="yaba-notebook-frame"
        width={frameWidth + "px"}
        height={frameHeight + "px"}
        style={{
          margin: 0,
          padding: 0,
          bottom: "20px",
          right: "24px",
          border: "none",
          borderRadius: "6px",
          colorScheme: "none",
          position: "relative",
        }}
        head={[
          <meta key={"notes-charSet"} charSet="utf-8" />,
          <link
            rel="stylesheet"
            key={"notes-css"}
            href={chrome.runtime.getURL("styles/foreground.css")}
          />,
        ]}
      >
        <Foreground
          isNotes={true}
          setFrameWidth={setFrameWidth}
          setFrameHeight={setFrameHeight}
        />
      </Frame>
    </>
  );
};

const render = () => {
  const isAuthPage = window.location.href === AUTH_URL;

  root.render(
    <RecoilRoot>
      {isAuthPage ? <Auth /> : <MainRoot key={"mainroot"} />}
    </RecoilRoot>
  );

  notesRoot.render(
    <RecoilRoot>
      {isAuthPage ? null : <NotesRoot key={"notesroot"} />}
    </RecoilRoot>
  );
};

render();
