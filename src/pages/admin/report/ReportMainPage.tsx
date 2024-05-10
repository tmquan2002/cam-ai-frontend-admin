import { ActionIcon, Box, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, Select, Table, Text, Tooltip, rem, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { MdFilterAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useGetAllInstallsFilter } from "../../../hooks/useEdgeBoxInstalls";
import { useGetAllShopsSelect } from "../../../hooks/useShops";
import { useLocalStorageCustomHook } from "../../../hooks/useStorageState";
import { DisabledEdgeBoxInstallFilterProps, pageSizeSelect } from "../../../types/constant";
import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from "../../../types/enum";
import { removeTime } from "../../../utils/dateTimeFunction";
import { DonutChartContainer } from "./components/DonutChartContainer";
import styled from "./report.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Report",
    },
]

const ReportMainPage = () => {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [storage, setStorage] = useLocalStorageCustomHook(DisabledEdgeBoxInstallFilterProps.FILTER, {
        pageIndex: 1,
        size: "5",
        filterActivationStatus: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
    })

    const { pageIndex, size, filterActivationStatus, filterSearchShopId, filterSearchShop } = storage;
    const [opened, { toggle }] = useDisclosure(false)
    const [rendered, setRendered] = useState(0)
    const navigate = useNavigate()

    const { data: installList, isFetching, refetch
    } = useGetAllInstallsFilter({
        pageIndex: (pageIndex - 1), size,
        edgeBoxInstallStatus: EdgeBoxInstallStatus.Disabled,
        activationStatus: filterActivationStatus !== "None" && filterActivationStatus !== "" ? filterActivationStatus : "",
        shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
    })

    const { data: shopList, refetch: refetchShop
    } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i} onClick={() => { }}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filterActivationStatus !== "None" || filterSearchShopId !== "None")
                && rendered !== 0) {
                refetch();
                setRendered(a => a + 1)
                setStorage(DisabledEdgeBoxInstallFilterProps.PAGE_INDEX, 1)
            } else {
                setRendered(x => x + 1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterActivationStatus, filterSearchShopId]);

    const onClearFilter = () => {
        setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, "")
        setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, "")
    }

    const rows = installList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/install/${e.id}`)}>
                <Table.Td ta={"left"}>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>

                <Table.Td ta={"left"}>{e?.shop?.name}</Table.Td>
                <Table.Td ta={"left"}>{e?.edgeBox?.name}</Table.Td>
                <Table.Td ta={"left"}>{e?.createdDate ? removeTime(new Date(e?.createdDate), "/") : "No Data"}</Table.Td>
                <Table.Td ta={"left"}>{e?.createdDate ? removeTime(new Date(e?.uninstalledTime), "/") : "No Data"}</Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBox?.edgeBoxLocation ?? "None"} />
                </Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.activationStatus ?? "None"} />
                </Table.Td>
            </Table.Tr>
        </Tooltip>
    ));

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <Box m={rem(32)}>
                    <Grid>
                        <Grid.Col span={6}>
                            <DonutChartContainer type="edgeBox" />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <DonutChartContainer type="install" />
                        </Grid.Col>
                    </Grid>
                </Box>
            </div>

            <Box m={rem(32)} p={rem(32)} bg={computedColorScheme == "light" ? "white" : "#1f1f1f"} className={styled["static-card"]}>
                {/* Top */}
                <Grid mt={5} mb={20} justify='space-between'>

                    <Grid.Col span={12}>
                        <Group justify="space-between">
                            <Text size='lg' fw="bold" fz='25px' c={"light-blue.4"}>
                                Uninstalled Edge Box List
                            </Text>
                            <Tooltip label="Filter" withArrow>
                                <ActionIcon color="grey" size={"lg"} w={20} onClick={toggle}>
                                    <MdFilterAlt />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Grid.Col>
                </Grid>

                {/* Filter */}
                <Collapse in={opened}>
                    <Divider />
                    <Grid mt={10} justify='space-between'>
                        <Grid.Col span={6}><Text ta="left">Filter Install</Text></Grid.Col>
                        <Grid.Col span="content"><Button variant='transparent'
                            onClick={onClearFilter}>
                            Clear All Filters
                        </Button>
                        </Grid.Col>
                    </Grid>
                    <Group mb="md">
                        <Text size='sm' fw={"bold"}>Activation Status: </Text>
                        <RadioGroup name="location" value={filterActivationStatus}
                            onChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, value)}>
                            <Group>
                                <Radio value={EdgeBoxActivationStatus.Activated.toString()} label={"Activated"} />
                                <Radio value={EdgeBoxActivationStatus.NotActivated.toString()} label={"NotActivated"} />
                                <Radio value={EdgeBoxActivationStatus.Pending.toString()} label={"Pending"} />
                                <Radio value={EdgeBoxActivationStatus.Failed.toString()} label={"Failed"} />
                            </Group>
                        </RadioGroup>
                    </Group>
                    <Group mt="md" mb="md">
                        <Text size='sm' fw={"bold"}>Shop: </Text>
                        <Select data={shopList || []} limit={5} size='sm'
                            nothingFoundMessage={shopList && "Not Found"}
                            value={filterSearchShopId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchShop}
                            onSearchChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, value)}
                            onChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, value)}
                        />
                    </Group>
                    <Divider />
                </Collapse>

                {/* Table */}
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Shop</Table.Th>
                                <Table.Th>EdgeBox</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th>Uninstall Date</Table.Th>
                                <Table.Th ta={"center"}>Location Status</Table.Th>
                                <Table.Th ta={"center"}>Activation Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
                <Group justify="space-between">
                    {isFetching || installList?.totalCount ?
                        <>
                            <Pagination total={installList?.totalCount ? Math.ceil(installList.totalCount / Number(size)) : 0} value={pageIndex} mt="sm"
                                onChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.PAGE_INDEX, value)} />
                            <Group style={{ marginTop: '12px' }}>
                                <Text>Page Size: </Text>
                                <Select
                                    onChange={(value) => {
                                        setStorage(DisabledEdgeBoxInstallFilterProps.PAGE_INDEX, 1)
                                        setStorage(DisabledEdgeBoxInstallFilterProps.SIZE, value)
                                    }}
                                    allowDeselect={false}
                                    placeholder="0" value={size}
                                    data={pageSizeSelect} defaultValue={"5"}
                                />
                            </Group>
                        </> :
                        <></>
                    }
                </Group>
            </Box>
        </div>
    );
};

export default ReportMainPage;
