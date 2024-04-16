import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllInstallsFilter } from '../../../../hooks/useEdgeBoxInstalls';
import { useGetAllShopsSelect } from '../../../../hooks/useShops';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { EdgeBoxInstallFilterProps, pageSizeSelect } from '../../../../types/constant';
import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from '../../../../types/enum';
import styled from "../styles/edgeboxinstall.module.scss";
import { MdFilterAlt } from 'react-icons/md';
// TODO: This install list (has Shop, edge box and 3 status)
const InstallList = () => {

    const [storage, setStorage] = useLocalStorageCustomHook(EdgeBoxInstallFilterProps.FILTER, {
        pageIndex: 1,
        size: "5",
        filterInstallStatus: "None",
        filterActivationStatus: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
    })

    const { pageIndex, size, filterInstallStatus, filterActivationStatus,
        filterSearchShop, filterSearchShopId } = storage;

    const [opened, { toggle }] = useDisclosure(false);
    const [rendered, setRendered] = useState(0)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i} onClick={() => {}}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: installList, isFetching, refetch
    } = useGetAllInstallsFilter({
        pageIndex: (pageIndex - 1), size,
        edgeBoxInstallStatus: filterInstallStatus !== "None" && filterInstallStatus !== "" ? filterInstallStatus : "",
        activationStatus: filterActivationStatus !== "None" && filterActivationStatus !== "" ? filterActivationStatus : "",
        shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
    })

    const { data: shopList, refetch: refetchShop
    } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filterInstallStatus !== "None" || filterActivationStatus !== "None" || filterSearchShopId !== "None")
                && rendered !== 0) {
                refetch();
                setRendered(a => a + 1)
                setStorage(EdgeBoxInstallFilterProps.PAGE_INDEX, 1)
            } else {
                setRendered(x => x + 1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterInstallStatus, filterActivationStatus, filterSearchShopId]);

    const onClearFilter = () => {
        setStorage(EdgeBoxInstallFilterProps.FILTER_INSTALL_STATUS, "")
        setStorage(EdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, "")
        setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, "")
    }

    const rows = installList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/install/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>

                <Table.Td>{e.shop?.name}</Table.Td>
                <Table.Td>{e.edgeBox?.name}</Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBoxInstallStatus ?? "None"} />
                </Table.Td>
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
        <>
            {/* Top */}
            <Grid mt={5} mb={20} justify='space-between'>

                <Grid.Col span={12}>
                    <Group justify="space-between">
                        <Text size='lg' fw="bold" fz='25px'
                            c={"light-blue.4"}
                        >EDGE BOX INSTALLATION LIST</Text>
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
                    <Grid.Col span={6}><Text>Filter Install</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mb="md">
                    <Text size='sm' fw={"bold"}>Health Status: </Text>
                    <RadioGroup name="status" value={filterInstallStatus}
                        onChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_INSTALL_STATUS, value)}>
                        <Group>
                            <Radio value={EdgeBoxInstallStatus.New.toString()} label={"New"} />
                            <Radio value={EdgeBoxInstallStatus.Working.toString()} label={"Working"} />
                            <Radio value={EdgeBoxInstallStatus.Unhealthy.toString()} label={"Unhealthy"} />
                            <Radio value={EdgeBoxInstallStatus.Disabled.toString()} label={"Disabled"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mb="md">
                    <Text size='sm' fw={"bold"}>Activation Status: </Text>
                    <RadioGroup name="location" value={filterActivationStatus}
                        onChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_ACTIVATION_STATUS, value)}>
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
                        onSearchChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP, value)}
                        onChange={(value) => setStorage(EdgeBoxInstallFilterProps.FILTER_SEARCH_SHOP_ID, value)}
                    />
                </Group>
                <Divider />
            </Collapse>

            {/* Table */}
            <ScrollArea.Autosize mah={400}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Shop</Table.Th>
                                <Table.Th>EdgeBox</Table.Th>
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