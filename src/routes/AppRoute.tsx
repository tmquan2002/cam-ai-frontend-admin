import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/common/login/LoginPage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BrandPage from "../pages/admin/brand/BrandPage";
import { useRoutes } from "react-router-dom";
import CommonRoute from "./CommonRoute";

const InitialLayout = () => {
  return useRoutes([
    {
      element: <CommonRoute />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
          index: true,
        },
        {
          path: "/brand",
          element: <BrandPage />,
          index: true,
        },
        {
          path: "*",
          element: <DashboardPage />,
        },
      ],
    },
  ]);
};

const AppRoute = () => {
  return <InitialLayout />;
};

export default AppRoute;
