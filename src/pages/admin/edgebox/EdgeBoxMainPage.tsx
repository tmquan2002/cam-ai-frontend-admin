import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import EdgeBoxList from "./components/EdgeBoxList";
import styled from "./styles/edgebox.module.scss";

const breadcrumbs: BreadcrumbItem[] = []

const EdgeBoxMainPage = () => {
    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <EdgeBoxList />
            </div>
        </div>
    );
};

export default EdgeBoxMainPage;
