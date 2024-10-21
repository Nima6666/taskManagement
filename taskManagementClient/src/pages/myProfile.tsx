import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import toast from "react-hot-toast";

export default function MyProfile() {
  const { loggedUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-32">
      {/* Profile Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-2xl text-white font-bold">
          {loggedUser.name ? loggedUser.name[0].toUpperCase() : "?"}
        </div>
      </div>

      {/* Profile Details */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {loggedUser.name}
        </h2>
        <p className="text-gray-600">{loggedUser.email}</p>
      </div>

      {/* Optional: Additional Information Section */}
      <div className="mt-4">
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          onClick={() => toast.error("Feature Comming Soon")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
