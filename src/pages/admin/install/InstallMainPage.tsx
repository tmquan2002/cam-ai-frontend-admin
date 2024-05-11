import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import InstallList from "./components/InstallList";
import styled from "./styles/edgeboxinstall.module.scss";

const breadcrumbs: BreadcrumbItem[] = []

const InstallMainPage = () => {
    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <InstallList />
            </div>
        </div>

    );
};

export default InstallMainPage;
