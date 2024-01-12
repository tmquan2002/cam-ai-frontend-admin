import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/common/login/LoginPage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BrandMainPage from "../pages/admin/brand/BrandMainPage";
import { useRoutes } from "react-router-dom";
import CommonRoute from "./CommonRoute";
import BrandDetail from "../pages/admin/brand/BrandDetail";
import BrandAdd from "../pages/admin/brand/BrandAdd";

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
          element: <BrandMainPage />,
          index: true,
        },
        {
          path: "/brand/add",
          element: <BrandAdd />,
          index: true,
        },
        {
          path: "/brand/:brandId",
          element: <BrandDetail />,
          index: true,
        },
        {
          path: "/brand/:brandId/update",
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
