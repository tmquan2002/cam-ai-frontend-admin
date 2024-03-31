import { SideBar } from "../../../components/sidebar/SideBar";
import EdgeBoxMainPage from "./EdgeBoxMainPage";
import styled from "./adminlayout.module.scss";

const MainLayout = () => {

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <EdgeBoxMainPage />
        </div>
    );
};

export default MainLayout;
