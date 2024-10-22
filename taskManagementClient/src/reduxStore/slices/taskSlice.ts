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
  completed_at: Date | null;
}

export interface SelectedTask {}

export interface TaskState {
  taskRetrievalPending: boolean;
  userTasks: Task[];
  selectedTask: {
    task: null | Task;
    resolved: boolean;
  };
  filter: {
    name: "created_at" | "due_date" | "title" | "description" | "complete";
    sort: "ASC" | "DESC";
  };
}

export const getUsersTasks = async (
  accessToken: string,
  field: object,
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
          ...field,
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
        const loggedInUser = await getAccessToken();
        dispatch(
          userActions.setLoggedUser({
            name: loggedInUser.name,
            accessToken: loggedInUser.newAccessToken,
            email: loggedInUser.email,
          })
        );
        return getUsersTasks(loggedInUser.newAccessToken, field, dispatch);
      }
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message);
    }
  }
};

export const getUsersTask = async (
  accessToken: string,
  dispatch: Function,
  task_id: string
): Promise<Task[] | undefined> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVERAPI}/task/${task_id}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    if (response.data.success) {
      dispatch(taskActions.setSelectedTask(response.data.task));
    } else {
      toast.error(response.data.message);
    }
  } catch (error: any) {
    console.log(error);

    if (error.response && error.response.data.message) {
      const { status } = error.response;
      if (status === 403) {
        const loggedInUser = await getAccessToken();
        dispatch(
          userActions.setLoggedUser({
            name: loggedInUser.name,
            accessToken: loggedInUser.newAccessToken,
            email: loggedInUser.email,
          })
        );
        return getUsersTask(loggedInUser.newAccessToken, dispatch, task_id);
      }
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message);
    }
    dispatch(taskActions.selectedTaskNull());
  }
};

export const deleteTask = async (
  accessToken: string,
  dispatch: Function,
  task_id: string,
  navigate: Function
): Promise<Task[] | undefined> => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVERAPI}/task/${task_id}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      navigate("/tasks");
    } else {
      toast.error(response.data.message);
    }
  } catch (error: any) {
    console.log(error);

    if (error.response && error.response.data.message) {
      const { status } = error.response;
      if (status === 403) {
        const loggedInUser = await getAccessToken();
        dispatch(
          userActions.setLoggedUser({
            name: loggedInUser.name,
            accessToken: loggedInUser.newAccessToken,
            email: loggedInUser.email,
          })
        );
        return deleteTask(
          loggedInUser.newAccessToken,
          dispatch,
          task_id,
          navigate
        );
      }
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message);
    }
  }
};

export const updateTaskStatus = async (
  accessToken: string,
  dispatch: Function,
  task_id: string,
  navigate: Function,
  update_to: boolean
): Promise<Task[] | undefined> => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVERAPI}/task/${task_id}`,
      { status_update_to: update_to },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(taskActions.clearCacheSetPending());
      navigate("/tasks");
    } else {
      toast.error(response.data.message);
    }
  } catch (error: any) {
    console.log(error);

    if (error.response && error.response.data.message) {
      const { status } = error.response;
      if (status === 403) {
        const loggedInUser = await getAccessToken();
        dispatch(
          userActions.setLoggedUser({
            name: loggedInUser.name,
            accessToken: loggedInUser.newAccessToken,
            email: loggedInUser.email,
          })
        );
        return updateTaskStatus(
          loggedInUser.newAccessToken,
          dispatch,
          task_id,
          navigate,
          update_to
        );
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
    selectedTask: {
      task: null,
      resolved: false,
    },
    filter: {
      name: "due_date",
      sort: "ASC",
    },
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
    setSelectedTask(state, action) {
      state.selectedTask.task = { ...action.payload };
      state.selectedTask.resolved = true;
    },
    setSelectedTaskPending(state) {
      state.selectedTask.resolved = false;
    },
    selectedTaskNull(state) {
      state.selectedTask.resolved = true;
      state.selectedTask.task = null;
    },
    setFilter(state, action) {
      if (state.filter.name === action.payload) {
        state.filter.sort = state.filter.sort === "ASC" ? "DESC" : "ASC";
      } else {
        state.filter.name = action.payload;
      }
    },
  },
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
