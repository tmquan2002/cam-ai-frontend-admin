import { Avatar, Box, Button, Divider, Grid, Group, Image, Loader, LoadingOverlay, Tabs, Text, rem } from "@mantine/core";
import { IconMail, IconNetwork, IconPhone, IconRouter, IconUser, IconUserCircle } from "@tabler/icons-react";
import { useState } from "react";
import { AiFillShop } from "react-icons/ai";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { EdgeBoxListByBrandId } from "../../../components/list/EdgeBoxListByBrandId";
import { EmployeeListById } from "../../../components/list/EmployeeListById";
import { ShopShortListById } from "../../../components/list/ShopShortListById";
import Navbar from "../../../components/navbar/Navbar";
import { useGetAccountById } from "../../../hooks/useAccounts";
import { useGetBrandById } from "../../../hooks/useBrands";
import styled from "./styles/branddetail.module.scss";

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
    const navigate = useNavigate();
    const location = useLocation();
    // console.log(params);
    const [activeTab, setActiveTab] = useState<string | null>(location?.state?.tab ?? 'shops')

    const { data, isLoading, error } = useGetBrandById(params.brandId!);
    const { data: dataManager, isLoading: isLoadingManager } = useGetAccountById(data?.brandManagerId);

    return (
        <>
            <div className={styled["container-right"]}>
                <Navbar items={breadcrumbs} goBack />
                {isLoading ?
                    <Box className={styled["loader"]}>
                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    </Box>
                    :
                    <div className={styled["container-detail"]}>
                        {error ? <Text fs="italic" ta="center">Brand not found</Text> :
                            <Grid justify="space-around">
                                <Grid.Col span={12}>
                                    {data?.banner && <Image h={270} mb={20} radius={5} src={data?.banner?.hostingUri} />}
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, lg: 3 }} mx={rem(20)} mb={50}>
                                    <Box mb={20}>
                                        <Group justify="center">
                                            <Avatar w={200} h={200} src={data?.logo?.hostingUri} mb={20}
                                                style={{ boxShadow: "0px 3px 4px #00000024, 0px 3px 3px #0000001f, 0px 1px 8px #00000033" }} />
                                        </Group>
                                        <Box>
                                            <Group mb={10} justify="center">
                                                <Text size="xl" fw={500}>{data?.name}</Text>
                                                <StatusBadge statusName={data?.brandStatus ? data.brandStatus : "None"} padding={10} size="sm" />
                                            </Group>

                                            <Group justify='center' mb={20}>
                                                <Button size="sm" variant="gradient"
                                                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                                                    onClick={() => navigate(`/brand/${params.brandId!}/update`)}>
                                                    Brand Settings
                                                </Button>
                                                {!dataManager?.id &&
                                                    <Button
                                                        onClick={() => navigate("/account/add", { state: { brandId: params.brandId!, name: data?.name } })} variant="gradient"
                                                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }} size="sm"
                                                    >
                                                        Add Manager
                                                    </Button>
                                                }
                                            </Group>

                                            {isLoadingManager ? <Loader size="sm" /> :
                                                dataManager?.id &&
                                                <Group>
                                                    <IconUser size={20} />
                                                    <Text c="dimmed">Brand Manager :
                                                        <Text span fw="bold">
                                                            <Link to={`/account/${dataManager.id}`} style={{ textDecoration: 'none' }}>
                                                                {" " + data?.brandManager?.name}
                                                            </Link>
                                                        </Text>
                                                    </Text>
                                                </Group>
                                            }
                                            {data?.email &&
                                                <Group>
                                                    <IconMail size={20} />
                                                    <Text c="dimmed">Email :
                                                        <Text span fw="bold" c="black">{" " + data?.email}</Text>
                                                    </Text>
                                                </Group>
                                            }
                                            {data?.phone &&
                                                <Group>
                                                    <IconPhone size={20} />
                                                    <Text c="dimmed">Phone :
                                                        <Text span fw="bold" c="black">{" " + data?.phone}</Text>
                                                    </Text>
                                                </Group>
                                            }
                                            {data?.brandWebsite &&
                                                <Group>
                                                    <IconNetwork size={20} />
                                                    <Text c="dimmed">Website :
                                                        <Text span fw="bold">
                                                            <a href={"https://" + data?.brandWebsite} style={{ textDecoration: "none" }} target="_blank">
                                                                {" " + data?.brandWebsite}
                                                            </a>
                                                        </Text>
                                                    </Text>
                                                </Group>
                                            }
                                        </Box>
                                    </Box>

                                    {data?.description &&
                                        <>
                                            <Text fz={16} fw={'bold'} c={"grey"}>About</Text>
                                            <Divider />
                                            <Text mt={10} mb={20}>{data?.description}</Text>
                                        </>
                                    }
                                    <Text fz={16} fw={'bold'} c={"grey"}>Company</Text>
                                    <Divider />
                                    <Text mt={5} fw="bold">{data?.companyName || "No Information"}</Text>
                                    {(data?.companyWard && data?.companyAddress) && <Text size="md">{data?.companyAddress}, {data?.companyWard?.name}, {data?.companyWard?.district?.name}, {data?.companyWard?.district?.province?.name}</Text>}
                                    {(data?.companyWard && !data?.companyAddress) && <Text size="md">{data?.companyWard?.name}, {data?.companyWard?.district?.name}, {data?.companyWard?.district?.province?.name}</Text>}
                                    {(!data?.companyWard && data?.companyAddress) && <Text size="md">{data?.companyAddress}</Text>}
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, lg: 8 }} mr={rem(32)}>
                                    <Tabs value={activeTab} onChange={setActiveTab}>
                                        <Tabs.List>
                                            <Tabs.Tab value="shops" leftSection={<AiFillShop size={20} />}>
                                                Shops
                                            </Tabs.Tab>
                                            <Tabs.Tab value="employees" leftSection={<IconUserCircle size={20} />}>
                                                Employees
                                            </Tabs.Tab>
                                            <Tabs.Tab value="edge boxes" leftSection={<IconRouter size={20} />}>
                                                Edge Boxes
                                            </Tabs.Tab>
                                        </Tabs.List>

                                        <Tabs.Panel value="shops">
                                            <ShopShortListById id={params.brandId!} idType="brand" />
                                        </Tabs.Panel>

                                        <Tabs.Panel value="employees">
                                            <EmployeeListById id={params.brandId!} type="brand" />
                                        </Tabs.Panel>

                                        <Tabs.Panel value="edge boxes">
                                            <EdgeBoxListByBrandId brandId={params.brandId!} />
                                        </Tabs.Panel>
                                    </Tabs>
                                </Grid.Col>
                            </Grid>
                        }
                    </div>
                }
            </div>
        </>
    );
};

export default BrandDetail;
