import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxStore/slices/rootReducer";
import { uiActions } from "../../reduxStore/slices/uiSlice";

export default function Model() {
  const { logoutModelView, modelView } = useSelector(
    (state: RootState) => state.ui
  );
  const dispatch = useDispatch();
  return (
    <div
      className="h-screen w-screen top-0 left-0 fixed bg-[#000000a7]"
      style={{
        zIndex: logoutModelView ? 40 : modelView ? 50 : 0,
      }}
      onClick={() => dispatch(uiActions.setModelClose())}
    ></div>
  );
}
