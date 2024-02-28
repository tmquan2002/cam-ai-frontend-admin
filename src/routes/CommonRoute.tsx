import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { RoleEnumName } from "../types/enum";

const CommonRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // console.log(1);

  useEffect(() => {
    const isUserHavePermission: boolean | undefined = checkRole([
      RoleEnumName.Admin,
      RoleEnumName.ShopManager,
      RoleEnumName.BrandManager,
      RoleEnumName.Employee,
      RoleEnumName.Technician
    ]);
    if (isUserHavePermission) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to={"dashboard"} />;
  }
};

export default CommonRoute;
