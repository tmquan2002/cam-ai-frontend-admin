import { Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { SideBar } from "../../../components/sidebar/SideBar";
import { UpdateBrandForm } from "./components/UpdateBrandForm";
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

const BrandUpdate = () => {

    const params = useParams();
    console.log(params);

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <div className={styled["container-detail"]}>
                <Navbar items={breadcrumbs} goBackLink="/brand" />
                <div className={styled["table-container"]}>
                    <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>UPDATE BRAND</Text>
                    <UpdateBrandForm id={params.brandId!}/>
                </div>
            </div>
        </div>
    );
};

export default BrandUpdate;
