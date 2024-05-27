import { ActionIcon, Box, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, Select, Table, Text, Tooltip, rem, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import * as _ from "lodash";
import { isEmpty } from "lodash";
import { useEffect, useMemo } from "react";
import { MdFilterAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GetEdgeBoxInstallParams } from "../../../apis/EdgeBoxInstallAPI";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useGetAllInstallsFilter } from "../../../hooks/useEdgeBoxInstalls";
import { useGetAllShopsSelect } from "../../../hooks/useShops";
import { useLocalStorageCustomHook } from "../../../hooks/useStorageState";
import { DisabledEdgeBoxInstallFilterProps, PAGE_SIZE_DEFAULT, PAGE_SIZE_SELECT } from "../../../types/constant";
import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from "../../../types/enum";
import { removeTime } from "../../../utils/dateTimeFunction";
import { DonutChartContainer } from "./components/DonutChartContainer";
import styled from "./report.module.scss";

const breadcrumbs: BreadcrumbItem[] = []

const ReportMainPage = () => {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [storage, setStorage] = useLocalStorageCustomHook(DisabledEdgeBoxInstallFilterProps.FILTER, {
        pageIndex: 1,
        size: PAGE_SIZE_DEFAULT,
        filterActivationStatus: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
    })

    const { pageIndex, size, filterActivationStatus, filterSearchShopId, filterSearchShop } = storage;
    const [opened, { toggle }] = useDisclosure(false)
    const navigate = useNavigate()

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

    const searchParams: GetEdgeBoxInstallParams = useMemo(() => {
        let sb: GetEdgeBoxInstallParams = {
            pageIndex: (pageIndex - 1), size: Number(size),
            edgeBoxInstallStatus: EdgeBoxInstallStatus.Unhealthy,
            activationStatus: filterActivationStatus !== "None" && filterActivationStatus !== "" ? filterActivationStatus : "",
            shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
        };
        sb = _.omitBy(sb, _.isNil) as GetEdgeBoxInstallParams;
        sb = _.omitBy(sb, _.isNaN) as GetEdgeBoxInstallParams;
        return sb;
    }, [pageIndex, size, filterActivationStatus, filterSearchShopId]);

    const { data: installList, isFetching } = useGetAllInstallsFilter(searchParams)
    const { data: shopList, refetch: refetchShop } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);
    
    const onClearFilter = () => {
        setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, "")
        setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, "")
    }

    const rows = installList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/install/${e.id}`)}>
                <Table.Td ta={"left"}>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>
                <Table.Td ta={"left"} c={e?.shop?.name ? undefined : "#bbbbbb"}>{e?.shop?.name ?? "No Data"}</Table.Td>
                <Table.Td ta={"left"} c={e?.edgeBox?.name ? undefined : "#bbbbbb"}>{e?.edgeBox?.name ?? "No Data"}</Table.Td>
                <Table.Td ta={"left"} c={e?.edgeBox?.serialNumber ? undefined : "#bbbbbb"}>{e?.edgeBox?.serialNumber ?? "No Data"}</Table.Td>
                <Table.Td ta={"left"} c={e?.createdDate ? undefined : "#bbbbbb"}>{e?.createdDate ? removeTime(new Date(e?.createdDate), "/") : "No Data"}</Table.Td>
                <Table.Td ta={"left"} c={e?.uninstalledTime ? undefined : "#bbbbbb"}>{e?.uninstalledTime ? removeTime(new Date(e?.uninstalledTime), "/") : "No Data"}</Table.Td>
                <Table.Td ta={"left"} c={e?.lastSeen ? undefined : "#bbbbbb"}>{e?.lastSeen ? removeTime(new Date(e?.lastSeen), "/") : "No Data"}</Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBox?.edgeBoxLocation ?? "None"} padding={10} size="sm" />
                </Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.activationStatus ?? "None"} padding={10} size="sm" />
                </Table.Td>
            </Table.Tr>
        </Tooltip>
    ));

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <Grid justify="center">
                <Grid.Col span={{ base: 12, lg: 4 }} >
                    <Box bg={computedColorScheme == "light" ? "white" : "#1f1f1f"} ml={32} mb={20}
                        style={{ boxShadow: "0px 3px 4px #00000024, 0px 3px 3px #0000001f, 0px 1px 8px #00000033" }}>
                        <DonutChartContainer />
                    </Box>
                    <Box bg={computedColorScheme == "light" ? "white" : "#1f1f1f"} ml={32}
                        style={{ boxShadow: "0px 3px 4px #00000024, 0px 3px 3px #0000001f, 0px 1px 8px #00000033" }}>
                        <DonutChartContainer />
                    </Box>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Box p={rem(32)} mr={20} bg={computedColorScheme == "light" ? "white" : "#1f1f1f"}
                        style={{ boxShadow: "0px 3px 4px #00000024, 0px 3px 3px #0000001f, 0px 1px 8px #00000033" }}>
                        {/* Top */}
                        <Grid mt={5} mb={20} justify='space-between'>
                            <Grid.Col span={12}>
                                <Group justify="space-between">
                                    <Text size='lg' fw="bold" fz='25px' c={"light-blue.4"}>
                                        Unhealthy Installations
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
                            <Grid my={10} align='flex-end'>
                                <Grid.Col span={6} ta="left">
                                    <RadioGroup name="location" value={filterActivationStatus} label="Activation Status"
                                        onChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, value)}>
                                        <Group>
                                            <Radio value={EdgeBoxActivationStatus.Activated.toString()} label={"Activated"} />
                                            <Radio value={EdgeBoxActivationStatus.NotActivated.toString()} label={"NotActivated"} />
                                            <Radio value={EdgeBoxActivationStatus.Pending.toString()} label={"Pending"} />
                                            <Radio value={EdgeBoxActivationStatus.Failed.toString()} label={"Failed"} />
                                        </Group>
                                    </RadioGroup>
                                </Grid.Col>
                                <Grid.Col span={6} ta="right">
                                    <Button variant='transparent'
                                        onClick={onClearFilter}>
                                        Clear All Filters
                                    </Button>
                                </Grid.Col>
                                <Grid.Col span={12} ta="left">
                                    <Select data={shopList || []} limit={5} size='xs' label="Shop" w={300}
                                        nothingFoundMessage={shopList && "Not Found"}
                                        value={filterSearchShopId} placeholder="Pick value" clearable searchable
                                        searchValue={filterSearchShop}
                                        onSearchChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, value)}
                                        onChange={(value) => setStorage(DisabledEdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, value)}
                                    />
                                </Grid.Col>
                            </Grid>
                            <Divider />
                        </Collapse>

                        {/* Table */}
                        <Table.ScrollContainer minWidth={600} p={10}>
                            <Table verticalSpacing={"sm"} striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>#</Table.Th>
                                        <Table.Th>Shop</Table.Th>
                                        <Table.Th>Edge Box</Table.Th>
                                        <Table.Th>Serial Number</Table.Th>
                                        <Table.Th>Created Date</Table.Th>
                                        <Table.Th>Uninstall Date</Table.Th>
                                        <Table.Th>Last Connected</Table.Th>
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
                                            data={PAGE_SIZE_SELECT}
                                            defaultValue={PAGE_SIZE_DEFAULT}
                                        />
                                    </Group>
                                </> :
                                <></>
                            }
                        </Group>
                    </Box>
                </Grid.Col>

            </Grid>
        </div>
    );
};

export default ReportMainPage;
