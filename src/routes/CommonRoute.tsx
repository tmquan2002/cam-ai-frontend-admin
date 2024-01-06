import { useRoutes } from "react-router-dom";
import LoginPage from "../pages/common/login/LoginPage";
import Dashboard from "../pages/admin/dashboard/Dashboard";

const CommonRoute = () => {

  let element = useRoutes([
    {
      path: "",
      element: <LoginPage />,
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

export default CommonRoute;
