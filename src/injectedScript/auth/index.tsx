import "./auth.scss";
import { useEffect } from "react";
import { db } from "../../../app/fb";
import { doc, setDoc } from "firebase/firestore";
import { AUTH_URL } from "../../../app/utils/constants";

const Auth = () => {
  const url = new URL(AUTH_URL);
  const origin = url.origin;

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
      window.postMessage({ type: "LOGIN_SUCCESS" }, origin);
    } catch (error) {
      window.postMessage({ type: "LOGIN_ERROR" }, origin);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await chrome.storage.local.get("user");
      window.postMessage({ type: user ? "LOGIN_SUCCESS" : "NO_USER" }, origin);
    };

    fetchUser();

    window.addEventListener("message", async event => {
      if (event.source === window && event.data.type === "LOGIN_DATA") {
        const { otherContactsData, userProfileData } = event.data;
        await handleAuth(userProfileData, otherContactsData);
      } else if (
        event.source === window &&
        event.data.type === "CLOSE_YABA_AUTH"
      ) {
        window.close();
      }
    });
  }, []);

  return <></>;
};

export default Auth;
