import "./auth.scss";
import { useEffect } from "react";
import { db } from "../../../app/fb";
import { doc, setDoc } from "firebase/firestore";

const Auth = () => {
  const handleAuth = async (userProfileData: any, otherContactsData: any) => {
    if (!userProfileData) window.postMessage({ type: "LOGIN_ERROR" }, "*");

    try {
      const data = {
        uid: userProfileData?.id,
        email: userProfileData?.email,
        name: userProfileData?.given_name,
        photoURL: userProfileData?.picture,
      };
      await setDoc(doc(db, "users", data.uid), data);
      await chrome.storage.local.set({ user: data });

      if (otherContactsData)
        await chrome.storage.local.set({
          userContacts: otherContactsData?.otherContacts,
        });

      chrome.runtime.sendMessage({ type: "refresh-auth" });
    } catch (error) {
      window.postMessage({ type: "LOGIN_ERROR" }, "*");
    }
  };

  useEffect(() => {
    window.addEventListener("message", async event => {
      if (event.source === window && event.data.type === "LOGIN_DATA") {
        const { otherContactsData, userProfileData } = event.data;
        await handleAuth(userProfileData, otherContactsData);
      }
    });
  }, []);

  return <></>;
};

export default Auth;
