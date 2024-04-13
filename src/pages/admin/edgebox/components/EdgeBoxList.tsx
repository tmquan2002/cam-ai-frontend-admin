import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Modal, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllEdgeBoxes } from '../../../../hooks/useEdgeBoxes';
import { EdgeBoxLocationStatus, EdgeBoxStatus } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateTimeFunction';
import styled from "../styles/edgebox.module.scss";
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { EdgeBoxFilterProps, pageSizeSelect } from '../../../../types/constant';
import { useGetAllShopsSelect } from '../../../../hooks/useShops';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { AddEdgeBoxForm } from './AddEdgeBoxForm';

const EdgeBoxList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(EdgeBoxFilterProps.FILTER, {
        pageIndex: 1,
        size: "5",
        searchTerm: "",
        filterStatus: "None",
        filterLocation: "None",
        filterSearchBrand: "",
        filterSearchBrandId: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
        initialData: true
    })

    const { pageIndex, size, searchTerm, filterStatus, filterLocation, initialData,
        filterSearchBrand, filterSearchBrandId, filterSearchShop, filterSearchShopId } = storage;

    const [clear, setClear] = useState(false)
    const [opened, { toggle }] = useDisclosure(false);
    const [modalAddOpen, { open: openAdd, close: closeAdd }] = useDisclosure(false);
    const [rendered, setRendered] = useState(0)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: edgeBoxList, isFetching, isLoading, refetch
    } = useGetAllEdgeBoxes({
        pageIndex: (pageIndex - 1), size, name: searchTerm,
        edgeBoxStatus: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
        edgeBoxLocation: filterLocation !== "None" && filterLocation !== "" ? filterLocation : "",
        brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
        shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
    })

    const { data: brandList, refetch: refetchBrand
    } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });

    const { data: shopList, refetch: refetchShop
    } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    const onSearch = (e: any) => {
        // console.log(e.key)
        if (e.key == "Enter" && !isEmpty(searchTerm)) {
            if (pageIndex == 1) {
                refetch()
            } else {
                setStorage(EdgeBoxFilterProps.PAGE_INDEX, 1)
            }
            setStorage(EdgeBoxFilterProps.INITIAL_DATA, false)
        }
    }

    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch();
            setRendered(a => a + 1)
        }
    }, [searchTerm, clear])

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filterStatus !== "None" || filterLocation !== "None" || filterSearchShopId !== "None" || filterSearchBrandId !== "None")
                && rendered !== 0) {
                refetch();
                setRendered(a => a + 1)
                setStorage(EdgeBoxFilterProps.PAGE_INDEX, 1)
            } else {
                setRendered(x => x + 1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterStatus, filterLocation, filterSearchShopId, filterSearchBrandId]);

    const onClearFilter = () => {
        setStorage(EdgeBoxFilterProps.FILTER_STATUS, "")
        setStorage(EdgeBoxFilterProps.FILTER_LOCATION, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND_ID, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP_ID, "")
    }

    const onClearSearch = () => {
        if (initialData) {
            setStorage(EdgeBoxFilterProps.SEARCH, "")
            return
        } else {
            onClearFilter();
            setStorage(EdgeBoxFilterProps.SEARCH, "");
            setStorage(EdgeBoxFilterProps.PAGE_INDEX, 1);
            setStorage(EdgeBoxFilterProps.INITIAL_DATA, true);
            setClear(true)
        }
    }

    const rows = edgeBoxList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/edgebox/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>

                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBoxStatus ? e.edgeBoxStatus : "None"} />
                </Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBoxLocation ? e.edgeBoxLocation : "None"} />
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
                        >EDGE BOX LIST</Text>
                        <Group>
                            <Tooltip label="Filter" withArrow>
                                <ActionIcon color="grey" size={"lg"} w={20} onClick={toggle}>
                                    <MdFilterAlt />
                                </ActionIcon>
                            </Tooltip>
                            <Button
                                onClick={openAdd} variant="gradient"
                                gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                            >
                                New
                            </Button>
                        </Group>
                    </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Group justify="space-between">
                        <TextInput w={'100%'}
                            placeholder="Search" leftSection={<MdOutlineSearch />}
                            rightSection={<MdClear style={{ cursor: 'pointer' }} onClick={onClearSearch} />}
                            value={searchTerm} onChange={(event) => { event.preventDefault(); setStorage(EdgeBoxFilterProps.SEARCH, event.currentTarget.value) }}
                            onKeyDown={onSearch}
                        />
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text>Filter Edge Box</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mb="md">
                    <Text size='sm' fw={"bold"}>Status: </Text>
                    <RadioGroup name="status" value={filterStatus}
                        onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_STATUS, value)}>
                        <Group>
                            <Radio value={EdgeBoxStatus.Active.toString()} label={"Active"} />
                            <Radio value={EdgeBoxStatus.Inactive.toString()} label={"Inactive"} />
                            <Radio value={EdgeBoxStatus.Broken.toString()} label={"Broken"} />
                            <Radio value={EdgeBoxStatus.Disposed.toString()} label={"Disposed"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mb="md">
                    <Text size='sm' fw={"bold"}>Location: </Text>
                    <RadioGroup name="location" value={filterLocation}
                        onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_LOCATION, value)}>
                        <Group>
                            <Radio value={EdgeBoxLocationStatus.Idle.toString()} label={"Idle"} />
                            <Radio value={EdgeBoxLocationStatus.Installing.toString()} label={"Installing"} />
                            <Radio value={EdgeBoxLocationStatus.Occupied.toString()} label={"Occupied"} />
                            <Radio value={EdgeBoxLocationStatus.Uninstalling.toString()} label={"Uninstalling"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mt="md" mb="md">
                    <Text size='sm' fw={"bold"}>Brand: </Text>
                    <Select data={brandList || []} limit={5} size='sm'
                        nothingFoundMessage={brandList && "Not Found"}
                        value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                        searchValue={filterSearchBrand}
                        onSearchChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND, value)}
                        onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND_ID, value)}
                    />
                </Group>
                <Group mt="md" mb="md">
                    <Text size='sm' fw={"bold"}>Shop: </Text>
                    <Select data={shopList || []} limit={5} size='sm'
                        nothingFoundMessage={shopList && "Not Found"}
                        value={filterSearchShopId} placeholder="Pick value" clearable searchable
                        searchValue={filterSearchShop}
                        onSearchChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP, value)}
                        onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP_ID, value)}
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
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                                <Table.Th ta={"center"}>Location Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                        {edgeBoxList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || edgeBoxList?.totalCount ?
                    <>
                        <Pagination total={edgeBoxList?.totalCount ? Math.ceil(edgeBoxList.totalCount / Number(size)) : 0} value={pageIndex} mt="sm"
                            onChange={(value) => setStorage(EdgeBoxFilterProps.PAGE_INDEX, value)} />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setStorage(EdgeBoxFilterProps.PAGE_INDEX, 1)
                                    setStorage(EdgeBoxFilterProps.SIZE, value)
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

            {/* Modal Add */}
            <Modal onClose={closeAdd} opened={modalAddOpen} title="New Edge Box" centered>
                <AddEdgeBoxForm close={closeAdd} refetch={refetch} />
            </Modal>
        </>
    );
}

export default EdgeBoxList;