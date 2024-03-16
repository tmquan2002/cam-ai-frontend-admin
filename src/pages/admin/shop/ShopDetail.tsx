import { Avatar, Box, Divider, Group, Loader, LoadingOverlay, Tabs, Text, useComputedColorScheme } from "@mantine/core";
import { AiFillControl, AiFillSnippets } from "react-icons/ai";
import { MdAccessTime, MdAccountCircle, MdEmail, MdHome, MdOutlineAccessTime, MdPhone } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { EdgeBoxListById } from "../../../components/list/EdgeBoxlistById";
import { EmployeeListById } from "../../../components/list/EmployeeListById";
import Navbar from "../../../components/navbar/Navbar";
import { useGetShopById } from "../../../hooks/useShops";
import { removeTime } from "../../../utils/dateFunction";
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

    const { data, isLoading, error } = useGetShopById(params.shopId!);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBack />
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["container-detail"]}>
                    {error ? <Text fs="italic" ta="center">Shop not found</Text> :
                        <>
                            <div className={styled["profile-header"]}>
                                <div className={styled["profile-header-left"]}>
                                    <div>
                                        <Group mb={15}>
                                            <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                            <StatusBadge statusName={data?.shopStatus ? data.shopStatus : "None"} type="shop" />
                                        </Group>
                                        <Group>
                                            <MdAccountCircle style={{ width: 18, height: 18 }} />
                                            Shop Manager: <Text size="md">{data?.shopManager ? data?.shopManager.name : "None"}</Text>
                                        </Group>
                                        <Group>
                                            <MdOutlineAccessTime />
                                            <Text size="md">Open: {data?.openTime || "No Data"} - Close: {data?.closeTime || "No Data"}</Text>
                                        </Group>
                                        {data?.phone &&
                                            <Group>
                                                <MdPhone style={{ width: 18, height: 18 }} />
                                                <Text size="md">{data?.phone}</Text>
                                            </Group>
                                        }
                                        {(data?.ward || data?.addressLine) &&
                                            <Group>
                                                <MdHome style={{ width: 18, height: 18 }} />
                                                {(data?.ward && data?.addressLine) && <Text size="md">{data.addressLine}, {data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                                {(data?.ward && !data?.addressLine) && <Text size="md">{data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                                {(!data?.ward && data?.addressLine) && <Text size="md">{data.addressLine}</Text>}
                                            </Group>
                                        }
                                        {data?.createdDate &&
                                            <Group mb={20}>
                                                <MdAccessTime style={{ width: 18, height: 18 }} />
                                                <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                            </Group>
                                        }
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
                                        {isLoading ?
                                            <Box className={styled["loader-tab"]}>
                                                <Loader />
                                            </Box>
                                            :
                                            <div className={styled["tab-detail"]}>
                                                <Group className={styled["brand-profile"]} mt={20}>
                                                    <Avatar w={150} h={150} mr={20} src={data?.brand?.logo?.hostingUri} />
                                                    <div>
                                                        <Group>
                                                            <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.brand?.name}</Text>
                                                            <StatusBadge statusName={data?.brand?.brandStatus ? data?.brand?.brandStatus : "None"} type="brand" />
                                                        </Group>
                                                        {data?.brand?.email &&
                                                            <Group>
                                                                <MdEmail />
                                                                <Text size="md">{data?.brand?.email}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.phone &&
                                                            <Group>
                                                                <MdPhone />
                                                                <Text size="md">{data?.brand?.phone}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.createdDate &&
                                                            <Group mb={20}>
                                                                <MdAccessTime />
                                                                <Text size="md">Created on: {data?.brand?.createdDate && removeTime(new Date(data?.brand?.createdDate), "/")}</Text>
                                                            </Group>
                                                        }
                                                    </div>
                                                </Group>
                                                <Link to={`/brand/${data?.brand.id}`} style={{ marginTop: 20, color: computedColorScheme === "dark" ? "white" : "#2d4b81" }}>View More</Link>
                                            </div>
                                        }
                                    </Tabs.Panel>

                                    <Tabs.Panel value="employees">
                                        <EmployeeListById id={params.shopId!} type="shop" />
                                    </Tabs.Panel>

                                    <Tabs.Panel value="edge boxes">
                                        <EdgeBoxListById id={params.shopId!} type="shop" />
                                    </Tabs.Panel>
                                </Tabs>
                            </div>
                        </>
                    }
                </div>

            }
        </div >
    );
};

export default ShopDetail;
