import { SideBar } from "../../../components/sidebar/SideBar";
import EdgeBoxDetail from "./EdgeBoxDetail";
import styled from "./adminlayout.module.scss";

const MainLayout = () => {

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <EdgeBoxDetail />
        </div>
    );
};

export default MainLayout;
