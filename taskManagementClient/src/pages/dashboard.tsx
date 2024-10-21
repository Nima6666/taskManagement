import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/slices/rootReducer";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { loggedUser } = useSelector((state: RootState) => state.user);
  console.log(loggedUser);
  return (
    <div className="mt-24">
      Your Tasks
      <Link to="/addTask">Add task</Link>
    </div>
  );
}
