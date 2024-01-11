import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/common/login/LoginPage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BrandPage from "../pages/admin/brand/BrandPage";
import { useRoutes } from "react-router-dom";
import CommonRoute from "./CommonRoute";
import BrandDetail from "../pages/admin/brand/BrandDetail";

const InitialLayout = () => {
  return useRoutes([
    {
      element: <CommonRoute />,
      children: [
        {
          path: "/",
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
          path: "/brand/:brandId",
          element: <BrandDetail />,
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
