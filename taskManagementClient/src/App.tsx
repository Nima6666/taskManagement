import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./pages/components/header";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./reduxStore/slices/rootReducer";
import { getAccessToken, userActions } from "./reduxStore/slices/userSlice";
import MyProfile from "./pages/myProfile";
import TaskForm from "./pages/taskForm";
import TaskDetails from "./pages/task";
import Tasks from "./pages/tasks";

function App() {
  const refreshToken = localStorage.getItem("refreshToken");
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function handleAsyncAccessTokenReq() {
      if (!loggedUser.accessToken) {
        const loggedInUser = await getAccessToken();
        dispatch(
          userActions.setLoggedUser({
            name: loggedInUser.name,
            accessToken: loggedInUser.newAccessToken,
            email: loggedInUser.email,
          })
        );
      } else {
        dispatch(userActions.setUserResolved());
      }
    }
    if (refreshToken) {
      handleAsyncAccessTokenReq();
    } else {
      console.log("e");
      dispatch(userActions.setUserResolved());
    }
  }, [loggedUser]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {loggedUser.accessToken ? (
          <Route path="*" element={<Navigate to="/tasks" />} />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
        {refreshToken && (
          <>
            <Route path="/addTask" element={<TaskForm />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:task_id" element={<TaskDetails />} />
            <Route path="/profile" element={<MyProfile />} />
          </>
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
