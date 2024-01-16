import { Outlet } from "react-router-dom";
import { SideBar } from "../../../components/sidebar/SideBar";
import styled from "./styles/brand.module.scss";

const BrandLayout = () => {

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <Outlet />
        </div>
    );
};

export default BrandLayout;
