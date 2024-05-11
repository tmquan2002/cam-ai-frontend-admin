import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Modal, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import * as _ from "lodash";
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GetEdgeBoxParams } from '../../../../apis/EdgeBoxAPI';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { useGetAllEdgeBoxes } from '../../../../hooks/useEdgeBoxes';
import { useGetAllShopsSelect } from '../../../../hooks/useShops';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { EdgeBoxFilterProps, pageSizeSelect } from '../../../../types/constant';
import { EdgeBoxLocationStatus, EdgeBoxStatus } from '../../../../types/enum';
import styled from "../styles/edgebox.module.scss";
import { AddEdgeBoxForm } from './AddEdgeBoxForm';


const EdgeBoxList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(EdgeBoxFilterProps.FILTER, {
        pageIndex: 1,
        size: "10",
        searchTerm: "",
        filterStatus: "None",
        filterLocation: "None",
        filterSearchBrand: "",
        filterSearchBrandId: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
    })

    const { pageIndex, size, searchTerm, filterStatus, filterLocation,
        filterSearchBrand, filterSearchBrandId, filterSearchShop, filterSearchShopId } = storage;
    const [debounced] = useDebouncedValue(searchTerm, 500)
    const [opened, { toggle }] = useDisclosure(false);
    const [modalAddOpen, { open: openAdd, close: closeAdd }] = useDisclosure(false);

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const searchParams: GetEdgeBoxParams = useMemo(() => {
        let sb: GetEdgeBoxParams = {
            pageIndex: (pageIndex - 1), size, name: debounced.toString(),
            edgeBoxStatus: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
            edgeBoxLocation: filterLocation !== "None" && filterLocation !== "" ? filterLocation : "",
            brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
            shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
        };
        sb = _.omitBy(sb, _.isNil) as GetEdgeBoxParams;
        sb = _.omitBy(sb, _.isNaN) as GetEdgeBoxParams;
        return sb;
    }, [pageIndex, size, filterStatus, debounced, filterSearchBrandId, filterSearchShopId]);

    const { data: edgeBoxList, isFetching, refetch } = useGetAllEdgeBoxes(searchParams)
    const { data: brandList, refetch: refetchBrand } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });
    const { data: shopList, refetch: refetchShop } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);

    const onClearFilter = () => {
        setStorage(EdgeBoxFilterProps.FILTER_STATUS, "")
        setStorage(EdgeBoxFilterProps.FILTER_LOCATION, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND_ID, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP_ID, "")
    }

    const rows = edgeBoxList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/edgebox/${e.id}`)}>
                <Table.Td>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>

                <Table.Td>{e.name}</Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBoxStatus ? e.edgeBoxStatus : "None"} padding={10} size='sm' />
                </Table.Td>
                <Table.Td ta={"center"}>
                    <StatusBadge statusName={e.edgeBoxLocation ? e.edgeBoxLocation : "None"} padding={10} size='sm' />
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
                        >Edge Box List</Text>
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
                            value={searchTerm}
                            onChange={(event) => {
                                event.preventDefault();
                                setStorage(EdgeBoxFilterProps.SEARCH, event.currentTarget.value)
                            }}
                        />
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={20} justify='space-between'>
                    <Grid.Col span={6}><Text fw="bold">Filter Edge Box</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Grid mb={20}>
                    <Grid.Col span={6}>
                        <RadioGroup name="status" value={filterStatus} label="Edge Box Status"
                            onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_STATUS, value)}>
                            <Group>
                                <Radio value={EdgeBoxStatus.Active.toString()} label={"Active"} />
                                <Radio value={EdgeBoxStatus.Inactive.toString()} label={"Inactive"} />
                                <Radio value={EdgeBoxStatus.Broken.toString()} label={"Broken"} />
                                <Radio value={EdgeBoxStatus.Disposed.toString()} label={"Disposed"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <RadioGroup name="location" value={filterLocation} label="Location Status"
                            onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_LOCATION, value)}>
                            <Group>
                                <Radio value={EdgeBoxLocationStatus.Idle.toString()} label={"Idle"} />
                                <Radio value={EdgeBoxLocationStatus.Installing.toString()} label={"Installing"} />
                                <Radio value={EdgeBoxLocationStatus.Occupied.toString()} label={"Occupied"} />
                                <Radio value={EdgeBoxLocationStatus.Uninstalling.toString()} label={"Uninstalling"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Select data={brandList || []} limit={5} size='xs' label="Brand" w={300}
                            nothingFoundMessage={brandList && "Not Found"}
                            value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchBrand}
                            onSearchChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND, value)}
                            onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_BRAND_ID, value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Select data={shopList || []} limit={5} size='xs' label="Shop" w={300}
                            nothingFoundMessage={shopList && "Not Found"}
                            value={filterSearchShopId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchShop}
                            onSearchChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP, value)}
                            onChange={(value) => setStorage(EdgeBoxFilterProps.FILTER_SEARCH_SHOP_ID, value)}
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
                                <Table.Th>Name</Table.Th>
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
                {isFetching || edgeBoxList?.totalCount ?
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