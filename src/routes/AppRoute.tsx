import { useEffect, useState } from "react";
import CommonRoute from "./CommonRoute";
import ProtectedRoute from "./ProtectedRoute";
import { TOKEN } from "../constants/LocalStorageItems";
import { useNavigate } from "react-router-dom";

const AppRoute = () => {
  //TODO: Replace with proper redux or local storage later
  let token = localStorage.getItem(TOKEN)
  const [login, setLogin] = useState(false)
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     setLogin(true)
  //   } else {
  //     setLogin(false)
  //     localStorage.clear();
  //     navigate("/");
  //   }
  // }, [])

  return (
    <>
      <CommonRoute />
      {/* {login && <ProtectedRoute />} */}
    </>
  );
};

export default AppRoute;
