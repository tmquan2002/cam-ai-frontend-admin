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
            <Navbar items={breadcrumbs} goBackLink="/brand" />
            <div className={styled["table-container"]}>
                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>NEW BRAND</Text>
                <AddBrandForm />
            </div>
        </div>
    );
};

export default BrandAdd;
