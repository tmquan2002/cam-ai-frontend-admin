import { Text } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { AddBrandForm } from "./components/AddBrandForm";
import styled from "./styles/brand.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Brand",
        link: "/brand"
    },
    {
        title: "Add"
    }
]

const BrandAdd = () => {

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>
                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>New Brand</Text>
                <AddBrandForm />
            </div>
        </div>
    );
};

export default BrandAdd;
