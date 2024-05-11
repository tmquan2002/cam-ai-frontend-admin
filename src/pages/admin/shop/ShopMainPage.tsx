import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import ShopList from "./components/ShopList";
import styled from "./styles/shop.module.scss";

const breadcrumbs: BreadcrumbItem[] = []
const ShopMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <ShopList />
            </div>
        </div>

    );
};

export default ShopMainPage;
