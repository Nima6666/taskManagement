import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import { uiActions } from "../reduxStore/slices/uiSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface TaskFormValues {
  title: string;
  description: string;
  due_date: string;
}

export default function TaskForm() {
  const pending = useSelector((state: RootState) => state.ui.pending);
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
    if (!values.due_date) {
      errors.due_date = "Due date is required";
    } else if (isNaN(Date.parse(values.due_date))) {
      errors.due_date = "Invalid date format";
    } else if (new Date(values.due_date).getTime() < Date.now()) {
      errors.due_date = "Date can not be in past";
    }
    return errors;
  };

  const handleTaskAdd = async (formData: TaskFormValues) => {
    console.log("Form Values:", formData);
    try {
      dispatch(uiActions.setPending());

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/task/`,
        {
          ...formData,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      dispatch(uiActions.setPendingResolved());
    }
  };

  return (
    <div
      className="w-full sm:w-[400px] mx-auto mt-32 p-5 rounded shadow-lg bg-white"
      style={{
        opacity: pending ? 0.6 : 1,
        cursor: pending ? "not-allowed" : "default",
      }}
    >
      <h1 className="text-2xl font-bold mb-6">Create Task</h1>
      <Formik
        initialValues={{
          title: "",
          description: "",
          due_date: "",
        }}
        validate={validate}
        onSubmit={handleTaskAdd}
      >
        {() => (
          <Form
            className="transition-all duration-300"
            style={{
              pointerEvents: pending ? "none" : "all",
            }}
          >
            <div className="grid grid-cols-1 gap-4">
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

              {/* Submit Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  {pending ? "Please Wait..." : "Create Task"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
