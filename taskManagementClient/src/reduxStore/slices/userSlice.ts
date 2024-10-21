import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export interface userState {
  loggedUser: {
    resolved: Boolean;
    accessToken: String | null;
    name: String | null;
    email: String | null;
  };
}

export async function getAccessToken(refreshToken: string) {
  console.log("requesting access token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVERAPI}/user/accessToken`,
      {
        refreshToken,
      }
    );
    if (response.data.success) {
      return response.data.loggedInUser;
    } else {
      return toast.error(response.data.message);
    }
  } catch (error: any) {
    console.log(error);
    console.log(error.status);
    if (error.status == 401) {
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      window.location.reload();
    }
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message);
    }
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedUser: {
      resolved: false,
      accessToken: null,
      name: null,
      email: null,
    },
  } as userState,
  reducers: {
    setLoggedUser(state, action) {
      console.log(action.payload);
      state.loggedUser.resolved = true;
      state.loggedUser.accessToken = action.payload.accessToken;
      state.loggedUser.name = action.payload.name;
      state.loggedUser.email = action.payload.email;
    },
    resetUser(state) {
      console.log("user reset");
      localStorage.removeItem("refreshToken");
      state.loggedUser.resolved = true;
      state.loggedUser.accessToken = null;
      state.loggedUser.name = null;
    },
    setUserResolved(state) {
      state.loggedUser.resolved = true;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
