import { db } from "../../fb";
import { createSlice } from "@reduxjs/toolkit";
import { doc, setDoc } from "firebase/firestore";

import { EncodeStr } from "../../utils/chrome";

const initialState = {
  user: null,
  isPending: false,
};

export const userSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
      chrome.storage.local.set({ user: action.payload });
    },

    setIsPending: (state, action) => {
      state.isPending = action.payload;
    },
  },
});

export const AuthSignIn = (userData, userContacts) => async dispatch => {
  const userId = EncodeStr(userData?.emailAddresses[0]?.value);

  const data = {
    uid: userId,
    name: userData?.names[0]?.displayName,
    email: userData?.emailAddresses[0]?.value,
    photoURL: userData?.photos[0]?.url,
  };

  await setDoc(doc(db, "users", data.uid), data);

  await chrome.storage.sync.set({ userId });
  await chrome.storage.local.set({ user: data });
  if (userContacts) await chrome.storage.local.set({ userContacts });

  window.close();
};

export const { setUserData, setIsPending } = userSlice.actions;
export default userSlice.reducer;
