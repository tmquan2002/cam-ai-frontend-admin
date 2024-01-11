import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { SideBar } from "../../../components/sidebar/SideBar";
import styled from "./styles/branddetail.module.scss";
import { useGetBrandById } from "../../../hooks/useBrands";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Brand",
        link: "/brand"
    },
    {
        title: "Detail"
    }
]

const BrandDetail = () => {

    const params = useParams();
    console.log(params);

    const {
        data: brandDetail,
        isLoading
    } = useGetBrandById(params.brandId!);

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <div className={styled["container-right"]}>
                <Navbar items={breadcrumbs} />
                <div className={styled["container-detail"]}>
                    {isLoading ? "AAAAAAAAAAA" : brandDetail?.name}
                </div>
            </div>
        </div>
    );
};

export default BrandDetail;
