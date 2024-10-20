import { configureStore } from "@reduxjs/toolkit";
// import uiSlice from "./slices/uiSlice";
import rootReducer from "./slices/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
});
