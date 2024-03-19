import { BarChart } from "@mantine/charts";
import { Box, Card, Grid, Group, LoadingOverlay, Select, Text, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useGetAllAccounts } from "../../../hooks/useAccounts";
import { useGetAllBrands } from "../../../hooks/useBrands";
import { useGetAllEdgeBoxes } from "../../../hooks/useEdgeBoxes";
import { useGetAllShops } from "../../../hooks/useShops";
import { countDataByDate } from "../../../utils/helperFunction";
import styled from "./dashboard.module.scss";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard"
    }
]

const TitleAndNumberCard = ({ title, data, loading, link }:
    { title: string, data: any, loading: boolean, link: string }) => {
    return (
        <Box className={styled["static-card"]} pos={"relative"} h={220}>
            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
            <p className={styled["static-card-title"]}>{title}</p>
            <div className={styled["static-card-number"]}>{data?.totalCount || "No Data"}</div>
            <Link to={link} className={styled["static-card-link"]}>View list</Link>
        </Box>
    );
};

const DashboardPage = () => {

    const { data: brandList, isLoading: isLoadingBrand } = useGetAllBrands({ size: 50 });
    const { data: accountList, isLoading: isLoadingAccount } = useGetAllAccounts({ size: 50 });
    const { data: shopList, isLoading: isLoadingShop } = useGetAllShops({ size: 50 });
    const { data: edgeBoxList, isLoading: isLoadingEdgeBox } = useGetAllEdgeBoxes({ size: 50 });
    const [sortBy, setSortBy] = useState<string | null>('Date');
    const [value, setValue] = useState<string | null>('Brand');

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
                        <Text size='lg' fw="bold" fz='25px' c={"light-blue.4"} mt={20}>COUNT CHART</Text>
                        <Group ml={40} mt={10} justify="space-between">
                            <Group ta="left">
                                <Select
                                    value={sortBy} onChange={setSortBy}
                                    label="Sort by"
                                    placeholder="Pick value"
                                    data={['Date', 'Total']}
                                    allowDeselect={false}
                                />
                                <Select
                                    value={value} onChange={setValue}
                                    label="View data"
                                    placeholder="Pick value"
                                    data={['Brand', 'Account', 'Shop', 'EdgeBox']}
                                    allowDeselect={false}
                                />
                            </Group>
                            <Text fs="italic" mr={30} size="sm">Data based from 50 latest records</Text>
                        </Group>
                        <BarChart h={300}
                            data={value == "Brand" ? countDataByDate(brandList, sortBy) :
                                value == "Account" ? countDataByDate(accountList, sortBy) :
                                    value == "Shop" ? countDataByDate(shopList, sortBy) :
                                        value == "EdgeBox" ? countDataByDate(edgeBoxList, sortBy) :
                                            []
                            }
                            dataKey="DateToShow"
                            tooltipAnimationDuration={200} py={rem(40)}
                            series={[
                                { name: "Total", color: "light-blue.6" },
                            ]}
                        />
                    </Card>
                </Box>
            </div>
        </div>
    );
};

export default DashboardPage;
