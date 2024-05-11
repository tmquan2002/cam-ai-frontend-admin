import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import * as _ from "lodash";
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { MdFilterAlt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GetEdgeBoxInstallParams } from '../../../../apis/EdgeBoxInstallAPI';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllInstallsFilter } from '../../../../hooks/useEdgeBoxInstalls';
import { useGetAllShopsSelect } from '../../../../hooks/useShops';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { EdgeBoxInstallFilterProps, pageSizeSelect } from '../../../../types/constant';
import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateTimeFunction';
import styled from "../styles/edgeboxinstall.module.scss";

const InstallList = () => {

    const [storage, setStorage] = useLocalStorageCustomHook(EdgeBoxInstallFilterProps.FILTER, {
        pageIndex: 1,
        size: "10",
        filterInstallStatus: "None",
        filterActivationStatus: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
    })

    const { pageIndex, size, filterInstallStatus, filterActivationStatus, filterSearchShop, filterSearchShopId } = storage;
    const [opened, { toggle }] = useDisclosure(false);

    const navigate = useNavigate();

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
            edgeBoxInstallStatus: filterInstallStatus !== "None" && filterInstallStatus !== "" ? filterInstallStatus : "",
            activationStatus: filterActivationStatus !== "None" && filterActivationStatus !== "" ? filterActivationStatus : "",
            shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
        };
        sb = _.omitBy(sb, _.isNil) as GetEdgeBoxInstallParams;
        sb = _.omitBy(sb, _.isNaN) as GetEdgeBoxInstallParams;
        return sb;
    }, [pageIndex, size, filterInstallStatus, filterActivationStatus, filterSearchShopId]);

    const { data: installList, isFetching } = useGetAllInstallsFilter(searchParams)
    const { data: shopList, refetch: refetchShop } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);

    const onClearFilter = () => {
        setStorage(EdgeBoxInstallFilterProps.FILTER_INSTALL_STATUS, "")
        setStorage(EdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, "")
        setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, "")
    }

    const rows = installList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/install/${e.id}`)}>
                <Table.Td>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>

                <Table.Td>{e?.shop?.name}</Table.Td>
                <Table.Td>{e?.edgeBox?.name}</Table.Td>
                <Table.Td>{e?.createdDate ? removeTime(new Date(e?.createdDate), "/") : "No Data"}</Table.Td>
                <Table.Td>{e?.createdDate ? removeTime(new Date(e?.uninstalledTime), "/") : "No Data"}</Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBoxInstallStatus ?? "None"} padding={10} size='sm' />
                </Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBox?.edgeBoxLocation ?? "None"} padding={10} size='sm' />
                </Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.activationStatus ?? "None"} padding={10} size='sm' />
                </Table.Td>
            </Table.Tr>
        </Tooltip>
    ));

    return (
        <>
            {/* Top */}
            <Grid mt={5} mb={20} justify='space-between'>

                <Grid.Col span={12}>
                    <Group justify="space-between">
                        <Text size='lg' fw="bold" fz='25px'
                            c={"light-blue.4"}
                        >Edge Box Installation List</Text>
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
                <Grid mt={20} justify='space-between'>
                    <Grid.Col span={6}><Text fw="bold">Filter Install</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Grid mb={20}>
                    <Grid.Col span={6}>
                        <RadioGroup name="status" value={filterInstallStatus} label="Install Helath"
                            onChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_INSTALL_STATUS, value)}>
                            <Group>
                                <Radio value={EdgeBoxInstallStatus.New.toString()} label={"New"} />
                                <Radio value={EdgeBoxInstallStatus.Working.toString()} label={"Working"} />
                                <Radio value={EdgeBoxInstallStatus.Unhealthy.toString()} label={"Unhealthy"} />
                                <Radio value={EdgeBoxInstallStatus.Disabled.toString()} label={"Disabled"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <RadioGroup name="location" value={filterActivationStatus} label="Activation Status"
                            onChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, value)}>
                            <Group>
                                <Radio value={EdgeBoxActivationStatus.Activated.toString()} label={"Activated"} />
                                <Radio value={EdgeBoxActivationStatus.NotActivated.toString()} label={"NotActivated"} />
                                <Radio value={EdgeBoxActivationStatus.Pending.toString()} label={"Pending"} />
                                <Radio value={EdgeBoxActivationStatus.Failed.toString()} label={"Failed"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Select data={shopList || []} limit={5} size='xs' label="Shop" w={300}
                            nothingFoundMessage={shopList && "Not Found"}
                            value={filterSearchShopId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchShop}
                            onSearchChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, value)}
                            onChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, value)}
                        />
                    </Grid.Col>
                </Grid>
                <Divider />
            </Collapse>

            {/* Table */}
            <ScrollArea.Autosize mah={600}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Shop</Table.Th>
                                <Table.Th>EdgeBox</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th>Uninstall Date</Table.Th>
                                <Table.Th ta={"center"}>Install Health</Table.Th>
                                <Table.Th ta={"center"}>Location Status</Table.Th>
                                <Table.Th ta={"center"}>Activation Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isFetching || installList?.totalCount ?
                    <>
                        <Pagination total={installList?.totalCount ? Math.ceil(installList.totalCount / Number(size)) : 0} value={pageIndex} mt="sm"
                            onChange={(value) => setStorage(EdgeBoxInstallFilterProps.PAGE_INDEX, value)} />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setStorage(EdgeBoxInstallFilterProps.PAGE_INDEX, 1)
                                    setStorage(EdgeBoxInstallFilterProps.SIZE, value)
                                }}
                                allowDeselect={false}
                                placeholder="0" value={size}
                                data={pageSizeSelect} defaultValue={"5"}
                            />
                        </Group>
                    </> :
                    <></>
                }
            </div>
        </>
    );
}

export default InstallList;