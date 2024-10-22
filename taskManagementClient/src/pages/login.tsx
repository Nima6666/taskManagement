import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import toast from "react-hot-toast";
import { uiActions } from "../reduxStore/slices/uiSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userActions } from "../reduxStore/slices/userSlice";
import { useEffect } from "react";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const pending = useSelector((state: RootState) => state.ui.pending);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userActions.resetUser());
  }, []);

  const validate = (formData: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    return errors;
  };

  const handleLogin = async (formData: FormValues) => {
    try {
      dispatch(uiActions.setPending());

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/user/login`,
        {
          ...formData,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        dispatch(
          userActions.setLoggedUser({
            name: response.data.name,
            email: response.data.email,
            accessToken: response.data.accessToken,
          })
        );
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
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={validate}
        onSubmit={handleLogin}
      >
        {() => (
          <Form
            className="transition-all duration-300"
            style={{
              pointerEvents: pending ? "none" : "all",
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="password"
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
                  {pending ? "Please Wait..." : "Login"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
