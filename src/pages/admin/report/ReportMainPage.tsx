import ReactPlayer from "react-player/youtube";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import styled from "./styles/report.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Report",
    },
]

const ReportMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <ReactPlayer
                    // playing
                    width={"auto"}
                    height={"600px"}
                    url={"https://youtu.be/uHxgR7GzRNY"}
                    controls
                />
            </div>
        </div>

    );
};

export default ReportMainPage;
