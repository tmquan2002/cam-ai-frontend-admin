import { useRoutes } from "react-router-dom";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import BrandPage from "../pages/admin/brand/BrandPage";

const ProtectedRoute = () => {
  let element = useRoutes([
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

export default ProtectedRoute;
