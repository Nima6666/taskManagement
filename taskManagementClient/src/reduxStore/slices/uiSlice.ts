import { createSlice } from "@reduxjs/toolkit";

export interface UIState {
  pending: boolean;
  logoutModelView: boolean;
  modelView: boolean;
}

const uiSlice = createSlice({
  name: "UI",
  initialState: {
    pending: false,
    logoutModelView: false,
    modelView: false,
  } as UIState,
  reducers: {
    setPending(state) {
      state.pending = true;
    },
    setPendingResolved(state) {
      state.pending = false;
    },
    setLogoutModelOpen(state) {
      state.logoutModelView = true;
    },
    setModelClose(state) {
      state.logoutModelView = false;
      state.modelView = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
