import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import { BounceLoader } from "react-spinners";

export default function MyProfile() {
  const { loggedUser } = useSelector((state: RootState) => state.user);

  if (!loggedUser.resolved) {
    return (
      <div className="flex justify-center items-center h-64 mt-32">
        <BounceLoader color="#4A90E2" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-32">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          My Profile
        </h2>
      </div>
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
    </div>
  );
}
