import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
// import { SideBar } from "../../../components/sidebar/SideBar";
import BrandList from "./components/BrandList";
import styled from "./styles/brand.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Brand",
    },
]

const BrandMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBackLink="/dashboard" />
            <div className={styled["table-container"]}>
                <BrandList />
            </div>
        </div>

    );
};

export default BrandMainPage;
