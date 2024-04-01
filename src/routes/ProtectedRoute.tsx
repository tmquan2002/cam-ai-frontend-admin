import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {  getUserRole } from "../context/AuthContext";
import { RoleEnum } from "../types/enum";

const ProtectedRoute = () => {
  const [userRole, setUserRole] = useState<RoleEnum | null>(RoleEnum.Admin);
  // console.log(isAuthenticated);

  useEffect(() => {
    const currentUserRole: RoleEnum | null = getUserRole();

    setUserRole(currentUserRole);
  }, []);

  if (userRole == RoleEnum.Admin) {
    return <Outlet />;
  } else {
    return <Navigate
      to={"/"}
      replace
    />;
  }
};

export default ProtectedRoute;
