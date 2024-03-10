import { useRoutes } from "react-router-dom";
import MainLayout from "../pages/admin/MainLayout";
import AccountAdd from "../pages/admin/account/AccountAdd";
import AccountDetail from "../pages/admin/account/AccountDetail";
import AccountMainPage from "../pages/admin/account/AccountMainPage";
import BrandAdd from "../pages/admin/brand/BrandAdd";
import BrandDetail from "../pages/admin/brand/BrandDetail";
import BrandMainPage from "../pages/admin/brand/BrandMainPage";
import BrandUpdate from "../pages/admin/brand/BrandUpdate";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import LoginPage from "../pages/common/login/LoginPage";
import CommonRoute from "./CommonRoute";
import ProtectedRoute from "./ProtectedRoute";
import ShopMainPage from "../pages/admin/shop/ShopMainPage";
import ShopDetail from "../pages/admin/shop/ShopDetail";
import AccountUpdate from "../pages/admin/account/AccountUpdate";
import EdgeBoxDetail from "../pages/admin/edgebox/EdgeBoxDetail";
import EdgeBoxMainPage from "../pages/admin/edgebox/EdgeBoxMainPage";
import ReportMainPage from "../pages/admin/report/ReportMainPage";
import EdgeBoxAdd from "../pages/admin/edgebox/EdgeBoxAdd";
import { NothingFoundBackground } from "../pages/common/404/NothingFoundBackground";

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
          element: <MainLayout />,
          children: [
            {
              element: <DashboardPage />,
              index: true,
            },
          ]
        },
        {
          path: "/account",
          element: <MainLayout />,
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
            {
              path: ":accountId/update",
              element: <AccountUpdate />,
            },
          ],
        },
        {
          path: "/brand",
          element: <MainLayout />,
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
          path: "/shop",
          element: <MainLayout />,
          children: [
            {
              element: <ShopMainPage />,
              index: true,
            },
            {
              path: ":shopId",
              element: <ShopDetail />,
            }
          ]
        },
        {
          path: "/edgebox",
          element: <MainLayout />,
          children: [
            {
              element: <EdgeBoxMainPage />,
              index: true,
            },
            {
              path: "add",
              element: <EdgeBoxAdd />,
            },
            {
              path: ":edgeBoxId",
              element: <EdgeBoxDetail />,
            }
          ]
        },
        {
          path: "/report",
          element: <MainLayout />,
          children: [
            {
              element: <ReportMainPage />,
              index: true,
            }
          ]
        },
        {
          path: "*",
          element: <NothingFoundBackground />,
        },
      ],
    },
    {
      path: "*",
      element: <NothingFoundBackground />
    }
  ]);
};

export default AppRoute;
