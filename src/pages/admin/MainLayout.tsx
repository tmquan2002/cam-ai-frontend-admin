import { Outlet } from "react-router-dom";
import { SideBar } from "../../components/sidebar/SideBar";
import styled from "./adminlayout.module.scss";

const MainLayout = () => {

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <Outlet />
        </div>
    );
};

export default MainLayout;
