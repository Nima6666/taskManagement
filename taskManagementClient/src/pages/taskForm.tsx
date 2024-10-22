import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import { uiActions } from "../reduxStore/slices/uiSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken, userActions } from "../reduxStore/slices/userSlice";
import { useEffect } from "react";
import { getUsersTask, taskActions } from "../reduxStore/slices/taskSlice";

interface TaskFormValues {
  title: string;
  description: string;
  due_date: string;
}

interface props {
  edit: boolean;
}

export default function TaskForm(props: props) {
  let task_id: null | string = null;
  const { edit } = props;
  if (edit) {
    task_id = useParams().task_id as string;
  }
  const pending = useSelector((state: RootState) => state.ui.pending);
  const { loggedUser } = useSelector((state: RootState) => state.user);
  const { selectedTask } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    async function getUsersTaskToEditHandler() {
      await getUsersTask(
        loggedUser.accessToken as string,
        dispatch,
        task_id as string
      );
    }
    if (loggedUser.resolved && loggedUser.accessToken && edit && task_id) {
      getUsersTaskToEditHandler();
    }
  }, [edit, task_id, selectedTask.resolved, loggedUser]);

  useEffect(() => {
    if (edit) {
      dispatch(taskActions.setSelectedTaskPending());
    }
  }, [edit]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const validate = (values: TaskFormValues) => {
    const errors: Partial<TaskFormValues> = {};
    if (!values.title) {
      errors.title = "Title is required";
    } else if (values.title.length > 255) {
      errors.title = "Title must be 255 characters or less";
    }
    if (!values.description) {
      errors.description = "Description is required";
    }
    if (!edit) {
      if (!values.due_date) {
        errors.due_date = "Due date is required";
      } else if (isNaN(Date.parse(values.due_date))) {
        errors.due_date = "Invalid date format";
      } else if (new Date(values.due_date).getTime() < Date.now()) {
        errors.due_date = "Date can not be in past";
      }
    }
    return errors;
  };

  const handleTaskAdd = async (
    formData: TaskFormValues,
    accessToken: string
  ) => {
    try {
      dispatch(uiActions.setPending());
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/task`,
        { ...formData },
        {
          headers: {
            Authorization: accessToken as string,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
      dispatch(uiActions.setPendingResolved());
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        const { status } = error.response;

        //  if status code is 403 i.e access token expired
        if (status === 403) {
          const loggedInUser = await getAccessToken();
          dispatch(
            userActions.setLoggedUser({
              name: loggedInUser.name,
              accessToken: loggedInUser.newAccessToken,
              email: loggedInUser.email,
            })
          );
          return handleTaskAdd(formData, loggedInUser.newAccessToken);
        }
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleTaskEdit = async (
    formData: TaskFormValues,
    accessToken: string
  ) => {
    try {
      dispatch(uiActions.setPending());
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/task/${task_id}`,
        { ...formData },
        {
          headers: {
            Authorization: accessToken as string,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
      dispatch(uiActions.setPendingResolved());
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        const { status } = error.response;

        //  if status code is 403 i.e access token expired
        if (status === 403) {
          const loggedInUser = await getAccessToken();
          dispatch(
            userActions.setLoggedUser({
              name: loggedInUser.name,
              accessToken: loggedInUser.newAccessToken,
              email: loggedInUser.email,
            })
          );
          return handleTaskEdit(formData, loggedInUser.newAccessToken);
        }
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div
      className="w-full sm:w-[400px] mx-auto mt-32 p-5 rounded shadow-lg bg-white"
      style={{
        opacity: pending || (edit && !selectedTask.resolved) ? 0.6 : 1,
        cursor:
          pending || (edit && !selectedTask.resolved)
            ? "not-allowed"
            : "default",
      }}
    >
      <h1 className="text-2xl font-bold mb-6">
        {edit ? "Edit" : "Create"} Task
      </h1>
      <Formik
        initialValues={{
          title:
            edit && selectedTask.resolved && selectedTask.task?.title
              ? selectedTask.task.title
              : "",
          description:
            edit && selectedTask.resolved && selectedTask.task?.description
              ? selectedTask.task.description
              : "",
          due_date: "",
        }}
        validate={validate}
        onSubmit={async (formData, { setSubmitting }) => {
          if (edit) {
            await handleTaskEdit(formData, loggedUser.accessToken as string);
          } else {
            await handleTaskAdd(formData, loggedUser.accessToken as string);
          }
          setSubmitting(false); // stop the form submission status
        }}
        enableReinitialize={true}
      >
        {() => (
          <Form
            className="transition-all duration-300"
            style={{
              pointerEvents:
                pending || (edit && !selectedTask.resolved) ? "none" : "all",
              cursor: !loggedUser.resolved ? "not-allowed" : "default",
            }}
          >
            <div
              className={`grid grid-cols-1 gap-4 ${
                !loggedUser.resolved && "pointer-events-none opacity-60"
              }`}
            >
              {/* Title Field */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none resize-none"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              {!edit && (
                <div className="mb-4">
                  <label
                    htmlFor="due_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Due Date and Time
                  </label>
                  <Field
                    type="datetime-local"
                    name="due_date"
                    className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                    min={getCurrentDateTime()}
                  />
                  <ErrorMessage
                    name="due_date"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  {pending || (edit && !selectedTask.resolved)
                    ? "Please Wait..."
                    : edit
                    ? "Edit Task"
                    : "Create Task"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
