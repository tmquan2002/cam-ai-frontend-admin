import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { SideBar } from "../../../components/sidebar/SideBar";
import BrandList from "./components/BrandList";
import styled from "./styles/brand.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        link: "/dashboard"
    },
    {
        title: "Brand"
    }
]

const BrandPage = () => {

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <div className={styled["container-detail"]}>
                <Navbar items={breadcrumbs} />
                <div className={styled["table-container"]}>
                    <BrandList />
                </div>
            </div>
        </div>
    );
};

export default BrandPage;
