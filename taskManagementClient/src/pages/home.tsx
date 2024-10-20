import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 p-6">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        Welcome to TASKYY
      </h1>
      <p className="text-lg text-white mb-6 text-center">
        Get ahead of yourself, manage your day-to-day tasks with us.
      </p>
      <Link
        to="/signup"
        className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
      >
        Get Started Now
      </Link>
    </div>
  );
}
