import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { UpdateBrandForm } from "./components/UpdateBrandForm";
import styled from "./styles/brand.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Brand",
        link: "/brand"
    },
    {
        title: "Update"
    }
]

const BrandUpdate = () => {

    const params = useParams();
    // console.log(params);

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>

                <UpdateBrandForm id={params.brandId!} />
            </div>
        </div>
    );
};

export default BrandUpdate;
