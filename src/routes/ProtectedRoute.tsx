import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
import { Role } from "../types/enum";

const ProtectedRoute = () => {
  const [userRole, setUserRole] = useState<Role | null>(Role.Admin)
  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();
    setUserRole(currentUserRole);
  }, []);

  switch (userRole) {
    case Role.Admin:
      return <Outlet />;
    default:
      return <Navigate to={"/"} />;
  }
};

export default ProtectedRoute;
