import { Badge, Divider, Image, Loader, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { NO_IMAGE_LOGO } from "../../../constants/ImagePlaceholders";
import { useGetShopById } from "../../../hooks/useShops";
import { removeTime } from "../../../utils/dateFormat";
import styled from "./styles/shopdetail.module.scss";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Shop",
        link: "/shop"
    },
    {
        title: "Detail"
    }
]

const ShopDetail = () => {

    const params = useParams();

    const { data, isLoading } = useGetShopById(params.shopId!);

    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBackLink="/shop" />
            {isLoading ? <Loader type="bar" /> :
                <div className={styled["container-detail"]}>
                    {data?.brand.bannerUri && <Image h={150} mb={20} src={data?.brand.bannerUri} />}
                    {/* <Image h={150} mb={20} src={data?.logoUri} /> */}
                    <div className={styled["profile-header"]}>
                        <div className={styled["profile-header-left"]}>
                            <Image w={150} h={150} mr={20} src={data?.brand.logoUri ? data?.brand.logoUri : NO_IMAGE_LOGO} />
                            <div>
                                <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                <Text size="sm">{data?.addressLine}</Text>
                                <Text size="xs" mb={20}>Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                <Badge size='lg' radius={"lg"} color="light-yellow.7">
                                    {data?.shopStatus ? data.shopStatus.name : "None"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Divider my="md" />
                    {/* TODO: Add more detail for the account */}
                    <div className={styled["profile-detail"]}>
                        <Text>{data?.phone}</Text>
                    </div>
                </div>
            }
        </div>
    );
};

export default ShopDetail;
