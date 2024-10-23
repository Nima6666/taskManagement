import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../reduxStore/slices/rootReducer";
import { BeatLoader } from "react-spinners";
import { uiActions } from "../../reduxStore/slices/uiSlice";
import Model from "./model";
import logoImg from "/taskyfy.png";

export default function Header() {
  const { loggedUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const { logoutModelView } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  return (
    <header className="bg-gray-800 text-white p-4 fixed w-screen top-0 z-50 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex justify-center items-center pl-4">
          <img src={logoImg} className="h-12 w-12 mr-2" />
          <div className="text-lg font-bold">TASKYFY</div>
        </Link>
        <nav className="pr-4">
          <ul className="flex space-x-4">
            {!loggedUser.resolved ? (
              <li className="h-12 w-12 flex justify-center items-center bg-slate-400 rounded-full text-2xl capitalize font-semibold text-slate-900">
                <BeatLoader size={10} />
              </li>
            ) : loggedUser.name ? (
              <div className="relative z-[45]">
                <li
                  className="h-12 w-12 flex justify-center items-center bg-slate-400 rounded-full text-2xl capitalize font-semibold text-slate-900 cursor-pointer"
                  onClick={() => dispatch(uiActions.setLogoutModelOpen())}
                >
                  {loggedUser.name && loggedUser.name[0].toUpperCase()}
                </li>
                {logoutModelView && (
                  <div className="absolute top-[120%] right-0 w-40 bg-white shadow-lg text-lg p-2 rounded-md flex flex-col items-start text-slate-900 font-semibold">
                    <button
                      className="w-full text-left py-2 px-4 hover:bg-red-200 transition rounded-md my-2"
                      onClick={() => {
                        localStorage.removeItem("refreshToken");
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                    <Link
                      to="/profile"
                      className="w-full text-left py-2 px-4 hover:bg-slate-200 transition rounded-md"
                      onClick={() => dispatch(uiActions.setModelClose())}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/tasks"
                      className="w-full text-left py-2 px-4 hover:bg-slate-200 transition rounded-md my-2"
                      onClick={() => dispatch(uiActions.setModelClose())}
                    >
                      Dashboard
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <li
                className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                onClick={() => navigate("/login")}
              >
                <div className="text-slate-900 font-semibold text-lg text-center block hover:text-slate-600 transition duration-200">
                  Login
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {logoutModelView && <Model />}
    </header>
  );
}
