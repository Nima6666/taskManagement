import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import { useEffect } from "react";
import {
  deleteTask,
  getUsersTask,
  taskActions,
  updateTaskStatus,
} from "../reduxStore/slices/taskSlice";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function TaskDetails() {
  const { selectedTask } = useSelector((state: RootState) => state.task);
  const { loggedUser } = useSelector((state: RootState) => state.user);
  const task_id = useParams().task_id as string;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    async function getTaskHandler() {
      await getUsersTask(loggedUser.accessToken as string, dispatch, task_id);
    }
    if (
      loggedUser.resolved &&
      loggedUser.accessToken &&
      !selectedTask.resolved
    ) {
      getTaskHandler();
    }
  }, [task_id, selectedTask.resolved, loggedUser]);
  useEffect(() => {
    dispatch(taskActions.setSelectedTaskPending());
  }, []);

  const deleteTaskHandler = async () => {
    await deleteTask(
      loggedUser.accessToken as string,
      dispatch,
      task_id,
      navigate
    );
  };

  const taskHandlerComplete = async () => {
    await updateTaskStatus(
      loggedUser.accessToken as string,
      dispatch,
      task_id,
      navigate,
      !selectedTask.task?.complete
    );
  };

  return (
    <div className="mt-32 mx-auto max-w-2xl p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-lg">
      <div className="w-full">
        <div
          className="p-2 px-4 bg-slate-50 w-fit rounded-md flex justify-center items-center cursor-pointer transition-all duration-300 shadow-inner hover:shadow-sm"
          onClick={() => navigate("/task")}
        >
          Go Back <span className="font-semibold text-2xl">{"<--"}</span>{" "}
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Task Details
      </h2>
      {selectedTask.resolved ? (
        selectedTask.task && Object.keys(selectedTask.task).length ? (
          <div className="bg-white rounded-lg p-6 shadow-md mb-4">
            <h3 className="text-2xl font-semibold text-blue-600">
              {selectedTask.task.title}
            </h3>
            <p className="text-gray-700 mt-2">
              {selectedTask.task.description}
            </p>
            <div className="mt-4">
              <p className="text-gray-600">
                <strong>Created At:</strong>{" "}
                {new Date(selectedTask.task.created_at).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    year: "numeric",
                    weekday: "long",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
              </p>
              <p className="text-gray-600">
                <strong>Due Date:</strong>{" "}
                {new Date(selectedTask.task.due_date).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedTask.task.complete
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {selectedTask.task.complete ? "Completed" : "Not Complete"}
                </span>
              </p>
              {selectedTask.task.complete && selectedTask.task.completed_at && (
                <p className="text-gray-600">
                  <strong>Completed On:</strong>{" "}
                  {new Date(selectedTask.task.completed_at).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      year: "numeric",
                      weekday: "long",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }
                  )}
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={deleteTaskHandler}
              >
                Delete Task
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                Edit Task
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={taskHandlerComplete}
              >
                {selectedTask.task.complete
                  ? "Mark Incomplete"
                  : "Mark Complete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Task Not found.</div>
        )
      ) : (
        <div className="flex justify-center items-center h-64">
          <BounceLoader color="#4A90E2" />
        </div>
      )}
    </div>
  );
}
