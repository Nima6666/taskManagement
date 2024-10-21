// rootReducer.ts
import { combineReducers } from "redux";
import uiReducer from "./uiSlice";
import userReducer from "./userSlice";

// Combine all the slice reducers into a root reducer
const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
});

// Create a type for the root state based on the root reducer
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
