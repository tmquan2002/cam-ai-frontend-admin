import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
import { Role } from "../types/enum";

const CommonRoute = () => {
  const [userRole, setUserRole] = useState<Role | null>(Role.Employee);
  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();
    setUserRole(currentUserRole);
  }, []);

  switch (userRole) {
    case Role.Admin:
      return <Navigate to={"/account"} />;
    default:
      return <Outlet />;
  }
};

export default CommonRoute;
