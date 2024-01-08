import { SideBar } from "../../../components/sidebar/SideBar";
import styled from "./styles/dashboard.module.scss";

const DashboardPage = () => {

    return (
        <>
            <div className={styled["container-main"]}>
                <SideBar />
            </div>
        </>
    );
};

export default DashboardPage;
