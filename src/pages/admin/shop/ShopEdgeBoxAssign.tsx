import { Loader, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useGetShopById } from "../../../hooks/useShops";
import { ShopEdgeBoxAssignForm } from "./components/ShopEdgeBoxAssignForm";
import styled from "./styles/shop.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Shop",
        link: "/shop"
    },
    {
        title: "Assign"
    }
]

const ShopEdgeBoxAssign = () => {

    const params = useParams();
    const { isLoading, error } = useGetShopById(params.shopId!);

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>
                {isLoading ? <Loader /> :
                    <>
                        {error ? <Text fs="italic" ta="center">Shop not found</Text> :
                            <>
                                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>ASSIGN EDGE BOX</Text>
                                <ShopEdgeBoxAssignForm shopId={params.shopId!} />
                            </>
                        }
                    </>
                }
            </div>
        </div>
    );
};

export default ShopEdgeBoxAssign;
