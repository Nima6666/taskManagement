import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { getAccessToken, userActions } from "./userSlice";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: Date;
  created_at: Date;
  edited_at: Date | null;
  complete: boolean;
}

export interface TaskState {
  taskRetrievalPending: boolean;
  userTasks: Task[];
}

export const getUsersTasks = async (
  accessToken: string,
  field: string,
  dispatch: Function
): Promise<Task[] | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVERAPI}/task/`,
      {
        headers: {
          Authorization: accessToken,
        },
        params: {
          field,
        },
      }
    );
    if (response.data.success) {
      dispatch(taskActions.setTasks(response.data.tasks));
    } else {
      toast.error(response.data.message);
    }
  } catch (error: any) {
    console.log(error);

    if (error.response && error.response.data.message) {
      const { status } = error.response;
      if (status === 403) {
        toast.success("requesting new access token");
        const loggedInUser = await getAccessToken();
        dispatch(
          userActions.setLoggedUser({
            name: loggedInUser.name,
            accessToken: loggedInUser.newAccessToken,
            email: loggedInUser.email,
          })
        );
        return getUsersTasks(loggedInUser.newAccessToken, dispatch);
      }
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message);
    }
  }
};

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    taskRetrievalPending: true,
    userTasks: [],
  } as TaskState,
  reducers: {
    setTasks(state, action) {
      state.userTasks = action.payload;
      state.taskRetrievalPending = false;
    },
    clearCacheSetPending(state) {
      state.userTasks = [];
      state.taskRetrievalPending = true;
    },
  },
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
