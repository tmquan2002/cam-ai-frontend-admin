import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/common/login/LoginPage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BrandMainPage from "../pages/admin/brand/BrandMainPage";
import { useRoutes } from "react-router-dom";
import CommonRoute from "./CommonRoute";
import BrandDetail from "../pages/admin/brand/BrandDetail";
import BrandAdd from "../pages/admin/brand/BrandAdd";
import BrandUpdate from "../pages/admin/brand/BrandUpdate";
import AccountMainPage from "../pages/admin/account/AccountMainPage";
import AccountAdd from "../pages/admin/account/AccountAdd";
import AccountLayout from "../pages/admin/account/AccountLayout";
import BrandLayout from "../pages/admin/brand/BrandLayout";
import AccountDetail from "../pages/admin/account/AccountDetail";

const AppRoute = () => {
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
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
          index: true,
        },
        {
          path: "/account",
          element: <AccountLayout />,
          children: [
            {
              element: <AccountMainPage />,
              index: true,
            },
            {
              path: "add",
              element: <AccountAdd />,
            },
            {
              path: ":accountId",
              element: <AccountDetail />,
            },
            // {
            //   path: "/brand/:brandId/update",
            //   element: <BrandUpdate />,
            // },
          ],
        },
        {
          path: "/brand",
          element: <BrandLayout />,
          children: [
            {
              element: <BrandMainPage />,
              index: true,
            },
            {
              path: "add",
              element: <BrandAdd />,
            },
            {
              path: ":brandId",
              element: <BrandDetail />,
            },
            {
              path: ":brandId/update",
              element: <BrandUpdate />,
            },
          ],
        },
        {
          path: "*",
          element: <DashboardPage />,
        },
      ],
    },
  ]);
};

export default AppRoute;
