import { BarChart } from "@mantine/charts";
import { ActionIcon, Box, Card, Flex, Grid, Group, LoadingOverlay, Menu, ThemeIcon, rem } from "@mantine/core";
import { IconDots, IconEye, IconFileZip, IconList, IconTrash, } from "@tabler/icons-react";
import * as _ from "lodash";
import { Link } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useGetAllAccounts } from "../../../hooks/useAccounts";
import { useGetAllBrands } from "../../../hooks/useBrands";
import { useGetAllEdgeBoxes } from "../../../hooks/useEdgeBoxes";
import { useGetAllShops } from "../../../hooks/useShops";
import { ShopCount } from "../../../models/Realtime";
import { convertCountDataToChartData } from "../../../utils/helperFunction";
import styled from "./styles/dashboard.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard"
    }
]

export interface ChartData {
    time: string;
    Phone: number;
    Laptop: number;
    Idle: number;
}

const fake_data: ShopCount[] = [
    {
        time: '2024-02-05T16:45:54.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 1
            },
            {
                actionType: "Laptop",
                count: 3
            },
            {
                actionType: "Idle",
                count: 5
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    },
    {
        time: '2024-02-05T17:20:30.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 4
            },
            {
                actionType: "Laptop",
                count: 1
            },
            {
                actionType: "Idle",
                count: 2
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    },
    {
        time: '2024-02-05T17:20:30.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 4
            },
            {
                actionType: "Laptop",
                count: 5
            },
            {
                actionType: "Idle",
                count: 2
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    },
    {
        time: '2024-02-05T20:30:12.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 2
            },
            {
                actionType: "Laptop",
                count: 4
            },
            {
                actionType: "Idle",
                count: 8
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    },
    {
        time: '2024-02-06T10:20:30.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 4
            },
            {
                actionType: "Laptop",
                count: 2
            },
            {
                actionType: "Idle",
                count: 5
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    },
    {
        time: '2024-02-07T12:20:30.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 4
            },
            {
                actionType: "Laptop",
                count: 3
            },
            {
                actionType: "Idle",
                count: 2
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    },
    {
        time: '2024-02-07T15:20:30.6569353+07:00',
        results: [
            {
                actionType: 'Phone',
                count: 2
            },
            {
                actionType: "Laptop",
                count: 5
            },
            {
                actionType: "Idle",
                count: 4
            }
        ],
        total: 7,
        shopId: "5da51038-8ef2-4cd3-aa31-0513e781c9e4"
    }
]

const TitleAndNumberCard = ({ title, data, loading, link }:
    { title: string, data: any, loading: boolean, link: string }) => {
    return (
        <Box className={styled["static-card"]} pos={"relative"} h={220}>
            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
            <p className={styled["static-card-title"]}>{title}</p>
            <div className={styled["static-card-number"]}>{data?.totalCount}</div>
            <Flex justify={"space-between"} align={"flex-end"}>
                <Link to={link} className={styled["static-card-link"]}>View detail</Link>
                <ThemeIcon
                    variant="light"
                    color={_.sample(["blue", "green", "red", "yellow"])}
                    style={{
                        height: rem(40),
                        width: rem(40),
                    }}
                >
                    <IconList
                        style={{ width: "60%", height: "60%" }}
                        stroke={1.5}
                    />
                </ThemeIcon>
            </Flex>
        </Box>
    );
};

const DashboardPage = () => {

    const { data: brandList, isLoading: isLoadingBrand } = useGetAllBrands({});
    const { data: accountList, isLoading: isLoadingAccount } = useGetAllAccounts({});
    const { data: shopList, isLoading: isLoadingShop } = useGetAllShops({});
    const { data: edgeBoxList, isLoading: isLoadingEdgeBox } = useGetAllEdgeBoxes({});

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["dashboard-detail"]}>
                <Box m={rem(32)}>
                    <Grid justify="space-between">
                        <Grid.Col span={3}>
                            <TitleAndNumberCard data={brandList} loading={isLoadingBrand}
                                link="/brand" title="Total Brands" />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <TitleAndNumberCard data={accountList} loading={isLoadingAccount}
                                link="/account" title="Total Accounts" />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <TitleAndNumberCard data={shopList} loading={isLoadingShop}
                                link="/shop" title="Total Shops" />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <TitleAndNumberCard data={edgeBoxList} loading={isLoadingEdgeBox}
                                link="/edgebox" title="Total Edge Boxes" />
                        </Grid.Col>
                    </Grid>
                    <Card my={rem(32)} className={styled["chart"]}>
                        <Card.Section withBorder inheritPadding>
                            <Group justify="space-between" my={rem(20)}>
                                <Menu withinPortal position="bottom-end" shadow="sm">
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="gray">
                                            <IconDots style={{ width: rem(16), height: rem(16) }} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<IconFileZip style={{ width: rem(14), height: rem(14) }} />}>
                                            Download zip
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                            Preview all
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />} color="red">
                                            Delete all
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        </Card.Section>
                        <BarChart h={300} data={convertCountDataToChartData(fake_data)} type="stacked" dataKey="time"
                            tooltipAnimationDuration={200} py={rem(40)}
                            series={[
                                { name: "Phone", color: "light-blue.2" },
                                { name: "Laptop", color: "light-blue.4" },
                                { name: "Idle", color: "light-blue.7" },
                            ]}
                        />
                    </Card>
                </Box>
            </div>
        </div>
    );
};

export default DashboardPage;
