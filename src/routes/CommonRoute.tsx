import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkRole, useSession } from "../context/AuthContext";
import { RoleEnum } from "../types/enum";

const CommonRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const sessionHook = useSession();

  useEffect(() => {
    const isUserHavePermission: boolean | undefined = checkRole([RoleEnum.Admin]);
    if (isUserHavePermission) {
      setIsAuthenticated(true);
    } else {
      sessionHook?.signOut()
    }
  }, []);

  if (!isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to={"dashboard"} />;
  }
};

export default CommonRoute;
