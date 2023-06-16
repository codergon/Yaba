import "./share.scss";
import Header from "../../layout/Header";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Compose from "./Compose";
import UserContacts from "./UserContacts";
import ShareOptions from "./ShareOptions";
import ComposeHeader from "./components/ComposeHeader";
import ContactsHeader from "./components/ContactsHeader";
import { Bookmark, LinkSimpleHorizontal } from "phosphor-react";

const ShareScreen = () => {
  const { state: data } = useLocation();
  const [navTo, setNavTo] = useState("");
  const [sendTo, setSendTo] = useState([]);
  const [screen, setScreen] = useState("options");
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    const validateAcct = async () => {
      const { userContacts } = await chrome.storage.local.get(["userContacts"]);
      if (Array.isArray(userContacts)) setContactList(userContacts);
    };
    validateAcct();
  }, []);

  return (
    <>
      {screen === "userContacts" ? (
        <ContactsHeader {...{ navTo, setNavTo, setScreen }} />
      ) : screen === "compose" ? (
        <ComposeHeader {...{ navTo, setNavTo, setScreen }} />
      ) : (
        <Header title="Share" />
      )}

      <div className="page-content share">
        {screen !== "userContacts" && (
          <div className="preview">
            <div className="media">
              {data?.thumbnail ? (
                <img src={data?.thumbnail} alt="" />
              ) : (
                <Bookmark size={20} weight="fill" color={"#B3B3B3"} />
              )}
            </div>

            <div className="details">
              <p className="title">{data?.title}</p>
              <div className="details-link-btn">
                <a href={data?.link} target="_blank" className="bkmk-link">
                  <LinkSimpleHorizontal size={13} weight="bold" />
                  <p>{data?.link ? new URL(data.link).host : null}</p>
                </a>

                {/* {screen === "options" && (
                  <button
                    className="continue-btn"
                    onClick={() => setScreen("compose")}
                  >
                    Continue
                  </button>
                )} */}
              </div>
            </div>
          </div>
        )}

        {screen === "options" ? (
          <ShareOptions {...{ data, setSendTo, setScreen, contactList }} />
        ) : screen === "userContacts" ? (
          <UserContacts
            {...{
              sendTo,
              setSendTo,
              setScreen,
              contactList,
            }}
          />
        ) : screen === "compose" ? (
          <Compose
            {...{ data, sendTo, setNavTo, setSendTo, setScreen, contactList }}
          />
        ) : null}
      </div>
    </>
  );
};

export default ShareScreen;
