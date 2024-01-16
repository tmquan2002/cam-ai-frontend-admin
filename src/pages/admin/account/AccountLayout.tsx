import { Outlet } from "react-router-dom";
import { SideBar } from "../../../components/sidebar/SideBar";
import styled from "./styles/account.module.scss";

const AccountLayout = () => {

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <Outlet />
        </div>
    );
};

export default AccountLayout;
