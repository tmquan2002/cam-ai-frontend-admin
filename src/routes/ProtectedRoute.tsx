import { useRoutes } from "react-router-dom";
import LoginPageProtected from "../pages/common/login/LoginPageProtected";
import Dashboard from "../pages/admin/dashboard/Dashboard";

const ProtectedRoute = () => {
  let element = useRoutes([
    {
      path: "/profile",
      element: <LoginPageProtected />,
      index: true,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      index: true,
    }
  ]);
  return element;
};

export default ProtectedRoute;
