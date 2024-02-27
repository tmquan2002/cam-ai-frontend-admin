import { Text } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { AddEdgeBoxForm } from "./components/AddEdgeBoxForm";
import styled from "./styles/edgebox.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Edge Box",
        link: "/edgebox"
    },
    {
        title: "Add"
    }
]

const EdgeBoxAdd = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>
                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>NEW EDGE BOX</Text>
                <AddEdgeBoxForm />
            </div>
        </div>
    );
};

export default EdgeBoxAdd;
