import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { RoleEnum } from "../types/enum";

const CommonRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  console.log(1);

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
