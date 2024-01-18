import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { RoleEnum } from "../types/enum";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  console.log(isAuthenticated);

  useEffect(() => {
    const isUserHavePermission: boolean | undefined = checkRole([
      {
        Id: RoleEnum.Admin,
        Name: "",
      },
      {
        Id: RoleEnum.BrandManager,
        Name: "",
      },
      {
        Id: RoleEnum.Technician,
        Name: "",
      },
    ]);
    if (!isUserHavePermission) {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    <Navigate
      to={"/"}
      replace
    />;
  }
};

export default ProtectedRoute;
