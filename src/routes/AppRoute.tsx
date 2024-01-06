import { useEffect, useState } from "react";
import CommonRoute from "./CommonRoute";
import ProtectedRoute from "./ProtectedRoute";
import { TOKEN } from "../constants/LocalStorageItems";

const AppRoute = () => {
  //TODO: Replace with proper redux or local storage later
  let token = localStorage.getItem(TOKEN)
  const [login, setLogin] = useState(false)

  useEffect(() => {
    if (token) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [])

  return (
    <>
      <CommonRoute />
      {login && <ProtectedRoute />}
    </>
  );
};

export default AppRoute;
