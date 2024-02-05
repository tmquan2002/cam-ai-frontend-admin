import { Text } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import styled from "./styles/edgebox.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Edge Box",
    },
]

const EdgeBoxMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <Text>Nothing here yet</Text>
            </div>
        </div>

    );
};

export default EdgeBoxMainPage;
