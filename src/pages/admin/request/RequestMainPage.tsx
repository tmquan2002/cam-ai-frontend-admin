import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import RequestList from "./RequestList";
import styled from "./request.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Request",
    },
]

const RequestMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <RequestList />
            </div>
        </div>

    );
};

export default RequestMainPage;
