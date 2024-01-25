import { Avatar, Badge, Box, Divider, Group, LoadingOverlay, Tabs, Text } from "@mantine/core";
import { AiFillControl, AiFillSnippets } from "react-icons/ai";
import { MdAccessTime, MdAccountCircle, MdEmail, MdHome, MdPhone } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
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
            <Navbar items={breadcrumbs} goBack />
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["container-detail"]}>
                    <div className={styled["profile-header"]}>
                        <div className={styled["profile-header-left"]}>
                            <div>
                                <Group>
                                    <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                    <Badge size='lg' radius={"lg"} color="shading.9">
                                        {data?.shopStatus ? data.shopStatus.name : "None"}
                                    </Badge>
                                </Group>
                                <Group>
                                    <MdAccountCircle />
                                    Shop Manager: <Text size="md">{data?.shopManager ? data?.shopManager : "None"}</Text>
                                </Group>
                                <Group>
                                    <MdPhone />
                                    <Text size="md">{data?.phone}</Text>
                                </Group>
                                <Group>
                                    <MdHome />
                                    <Text size="md">{data?.addressLine}, {data?.ward?.name}, {data?.ward?.district?.name}, {data?.ward?.district?.province?.name}</Text>
                                </Group>
                                <Group mb={20}>
                                    <MdAccessTime />
                                    <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                </Group>
                            </div>
                        </div>
                    </div>
                    <Divider my="md" />
                    <div className={styled["profile-detail"]}>
                        <Tabs defaultValue="brand">
                            <Tabs.List>
                                <Tabs.Tab value="brand" leftSection={<AiFillSnippets />}>
                                    Brand
                                </Tabs.Tab>
                                <Tabs.Tab value="employees" leftSection={<MdAccountCircle />}>
                                    Employees
                                </Tabs.Tab>
                                <Tabs.Tab value="edge boxes" leftSection={<AiFillControl />}>
                                    Edge Boxes
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="brand">
                                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-start' }}>
                                    <Group className={styled["brand-profile"]} mt={20}>
                                        <Avatar w={150} h={150} mr={20} src={data?.brand?.logoUri ? data?.brand?.logoUri : NO_IMAGE_LOGO} />
                                        <div>
                                            <Group>
                                                <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                                <Badge size='lg' radius={"lg"} color="shading.9">
                                                    {data?.brand?.brandStatus ? data?.brand?.brandStatus.name : "None"}
                                                </Badge>
                                            </Group>
                                            <Group>
                                                <MdEmail />
                                                <Text size="md">{data?.brand?.email}</Text>
                                            </Group>
                                            <Group>
                                                <MdPhone />
                                                <Text size="md">{data?.brand?.phone}</Text>
                                            </Group>
                                            <Group mb={20}>
                                                <MdAccessTime />
                                                <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                            </Group>
                                        </div>
                                    </Group>
                                    <Link to={`/brand/${data?.brand.id}`} style={{ marginTop: 20, color: "#2d4b81" }}>View More</Link>
                                </div>
                            </Tabs.Panel>

                            {/* TODO: Employee list */}
                            <Tabs.Panel value="employees">
                                Employee tab content coming soon
                            </Tabs.Panel>

                            {/* TODO: Edge Box list */}
                            <Tabs.Panel value="edge boxes">
                                Edge Box tab content coming soon
                            </Tabs.Panel>
                        </Tabs>
                    </div>
                </div>
            }
        </div>
    );
};

export default ShopDetail;
