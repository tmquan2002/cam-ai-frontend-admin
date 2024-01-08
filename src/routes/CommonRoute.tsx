import { useRoutes } from "react-router-dom";
import LoginPage from "../pages/common/login/LoginPage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BrandPage from "../pages/admin/brand/BrandPage";

const CommonRoute = () => {

  let element = useRoutes([
    {
      path: "",
      element: <LoginPage />,
      index: true,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
      index: true,
    },
    {
      path: "/brand",
      element: <BrandPage />,
      index: true,
    }
  ]);
  return element;
};

export default CommonRoute;
