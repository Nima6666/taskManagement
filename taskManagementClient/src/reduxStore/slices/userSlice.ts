import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "User",
  initialState: {
    accessToken: 
  },
  reducers: {
    // setPending(state) {
    //   state.pending = true;
    // },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
