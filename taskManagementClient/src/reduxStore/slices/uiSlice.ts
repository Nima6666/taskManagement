import { createSlice } from "@reduxjs/toolkit";

export interface UIState {
  pending: boolean;
}

const uiSlice = createSlice({
  name: "UI",
  initialState: {
    pending: false,
  } as UIState,
  reducers: {
    setPending(state) {
      state.pending = true;
    },
    setPendingResolved(state) {
      state.pending = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
