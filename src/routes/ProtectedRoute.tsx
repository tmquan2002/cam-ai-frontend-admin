import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { RoleEnumName } from "../types/enum";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  // console.log(isAuthenticated);

  useEffect(() => {
    const isUserHavePermission: boolean | undefined = checkRole([RoleEnumName.Admin]);
    if (!isUserHavePermission) {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate
      to={"/"}
      replace
    />;
  }
};

export default ProtectedRoute;
