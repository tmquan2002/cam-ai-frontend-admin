import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import EdgeBoxInstallList from "./components/EdgeBoxList";
import styled from "./styles/edgeboxinstall.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Installs",
    },
]

const InstallMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <EdgeBoxInstallList />
            </div>
        </div>

    );
};

export default InstallMainPage;
