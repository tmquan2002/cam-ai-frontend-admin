import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { SideBar } from "../../../components/sidebar/SideBar";
import styled from "./styles/dashboard.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard"
    }
]

const DashboardPage = () => {

    return (
        <>
            <div className={styled["container-main"]}>
                <SideBar />
                <div className={styled["container-detail"]}>
                    <Navbar items={breadcrumbs} />
                    <div className={styled["table-container"]}>
                        {/* <BrandList /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
