import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

// reducer
import rootReducer from "./reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["Common", "Shield"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
