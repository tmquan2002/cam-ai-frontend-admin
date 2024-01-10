import { Navigate, Outlet } from "react-router-dom";
import { getUserRoles, useSession } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { RoleEnum } from "../types/enum";
import { isEmpty } from "../utils/helperFunction";

const ProtectedRoute = () => {
  const sessionHook = useSession();

  const [{ isAdminRole, isSessionAvailable }, setAuthenticatedValue] =
    useState<{ isAdminRole: boolean; isSessionAvailable: boolean }>({
      isAdminRole: false,
      isSessionAvailable: false,
    });

  useEffect(() => {
    const userRole = getUserRoles();
    let isAdminRoles = false;
    let isSessionAvailables = false;
    if (userRole) {
      isAdminRoles = userRole[0].Id == RoleEnum.Admin;
      isSessionAvailables = !isEmpty(sessionHook?.session);

      // console.log(location, isAdminRole, isSessionAvailable);
    }
    setAuthenticatedValue({
      isAdminRole: isAdminRoles,
      isSessionAvailable: isSessionAvailables,
    });
  }, [sessionHook?.session]);

  if (isSessionAvailable && isAdminRole) {
    return <Outlet />;
  } else {
    <Navigate
      to={"/"}
      replace
    />;
  }
};

export default ProtectedRoute;
