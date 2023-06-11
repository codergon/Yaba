import user from "./user/userSlice";
import space from "./workspace/workspaceSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: { user, space },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
