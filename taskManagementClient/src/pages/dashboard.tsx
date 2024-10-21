import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getUsersTasks, taskActions } from "../reduxStore/slices/taskSlice";
import { BounceLoader } from "react-spinners";

export default function Dashboard() {
  const { loggedUser } = useSelector((state: RootState) => state.user);
  const { taskRetrievalPending, userTasks } = useSelector(
    (state: RootState) => state.task
  );
  const dispatch = useDispatch();

  useEffect(() => {
    async function getTasksHandler() {
      await getUsersTasks(
        loggedUser.accessToken as string,
        "due_date",
        dispatch
      );
    }
    if (loggedUser.resolved && loggedUser.accessToken) {
      getTasksHandler();
    }
  }, [loggedUser]);

  useEffect(() => {
    dispatch(taskActions.clearCacheSetPending());
  }, []);

  async function sortByHandler(field: string) {
    console.log(field);
  }

  return (
    <div className="container mx-auto mt-24 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Tasks</h1>

      {taskRetrievalPending ? (
        <div className="flex justify-center items-center h-64">
          <BounceLoader color="#4A90E2" />
        </div>
      ) : (
        <>
          {userTasks.length ? (
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <tr>
                    <th
                      className="border px-6 py-3 text-left"
                      onClick={() => sortByHandler("title")}
                    >
                      Title
                    </th>
                    <th
                      className="border px-6 py-3 text-left"
                      onClick={() => sortByHandler("created_at")}
                    >
                      Created Date
                    </th>
                    <th
                      className="border px-6 py-3 text-left"
                      onClick={() => sortByHandler("due_date")}
                    >
                      Due Date
                    </th>
                    <th className="border px-6 py-3 text-left">Complete</th>
                    <th className="border px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {userTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="border px-6 py-4">{task.title}</td>
                      <td className="border px-6 py-4">
                        {new Date(task.created_at).toLocaleString()}
                      </td>
                      <td className="border px-6 py-4">
                        {new Date(task.due_date).toLocaleString()}
                      </td>
                      <td className="border px-6 py-4 text-center">
                        {task.complete ? "Yes" : "No"}
                      </td>
                      <td className="border px-6 py-4 flex space-x-2">
                        <button
                          className={`bg-green-500 text-white font-bold py-1 px-2 rounded ${
                            task.complete
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-green-700"
                          }`}
                          // onClick={() => handleComplete(task.id)}
                          disabled={task.complete}
                        >
                          {task.complete ? "Completed" : "Mark Complete"}
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                          // onClick={() => handleViewDetails(task.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No tasks found.
            </div>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/addTask"
              className="bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-4 rounded"
            >
              Add Task
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
