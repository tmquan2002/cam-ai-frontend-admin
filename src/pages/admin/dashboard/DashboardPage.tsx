import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import styled from "./styles/dashboard.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard"
    }
]

const DashboardPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["dashboard-detail"]}>
                {/* <BrandList /> */}
            </div>
        </div>
    );
};

export default DashboardPage;
