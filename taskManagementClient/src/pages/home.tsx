import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../reduxStore/slices/rootReducer";
import { BeatLoader } from "react-spinners";
import logoImg from "/taskyfy.png";

export default function Home() {
  const { loggedUser } = useSelector((state: RootState) => state.user);
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 p-6 ">
      <div className="flex flex-col justify-center items-center">
        <img src={logoImg} className="h-60 w-60 mb-8" alt="" />
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Welcome to TASKYY
        </h1>
      </div>
      <p className="text-lg text-white mb-6 text-center">
        Get ahead of yourself, managing your day-to-day tasks.
      </p>
      {loggedUser.resolved && loggedUser.accessToken ? (
        <Link
          to="/tasks"
          className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg m-2"
        >
          Go to dashboard
        </Link>
      ) : !loggedUser.resolved ? (
        <div>
          <BeatLoader color="white" />
        </div>
      ) : (
        <div>
          <Link
            to="/signup"
            className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg m-2"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg m-2"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
