import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../reduxStore/slices/uiSlice";
import { RootState } from "../reduxStore/slices/rootReducer";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userActions } from "../reduxStore/slices/userSlice";

// Define the initial form value type
interface FormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const pending = useSelector((state: RootState) => state.ui.pending);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.resetUser());
  }, []);

  const navigate = useNavigate();

  const validate = (formData: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!formData.fullName) {
      errors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 2) {
      errors.fullName = "Full Name must be at least 2 characters";
    }
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
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    }
    return errors;
  };

  const handleSubmit = async (formData: FormValues) => {
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passowrds doesnt match");
    }

    try {
      dispatch(uiActions.setPending());

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/user/`,
        {
          ...formData,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
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
      <div className="text-slate-600 text-center flex flex-col justify-center items-start mb-2">
        <strong>Note</strong>
        <div className="text-sm">Please use real email to get reminders.</div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Signup</h1>
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form
            className="transition-all duration-300"
            style={{
              pointerEvents: pending ? "none" : "all",
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              {/* Full Name Field */}
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Field
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="fullName"
                  id="fullName"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

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
                  id="email"
                  autocomplete="on"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="email"
                  id="email"
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
                  id="password"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="password"
                  id="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="mt-1 p-2 block w-full border border-gray-300 transition-all duration-300 focus:border-gray-900 rounded-md shadow-sm outline-none"
                />
                <ErrorMessage
                  name="confirmPassword"
                  id="confirmPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="my-4">
                <p>
                  Have account?{" "}
                  <Link to="/login" className="font-semibold text-green-800">
                    Login
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  {pending ? "Please Wait..." : "Signup"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
