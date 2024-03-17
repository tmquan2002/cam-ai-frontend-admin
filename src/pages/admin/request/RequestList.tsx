import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Switch, Table, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { MdFilterAlt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../components/badge/StatusBadge';
import { useGetAllAccountsSelect } from '../../../hooks/useAccounts';
import { useGetAllBrandsSelect } from '../../../hooks/useBrands';
import { useGetAllEdgeBoxesSelect } from '../../../hooks/useEdgeBoxes';
import { useGetAllRequests } from '../../../hooks/useRequest';
import { useGetAllShopsSelect } from '../../../hooks/useShops';
import { useLocalStorageCustomHook } from '../../../hooks/useStorageState';
import { RequestFilterProps } from '../../../types/constant';
import { RequestStatus, RequestType } from '../../../types/enum';
import { removeTime } from '../../../utils/dateFunction';
import styled from "./request.module.scss";

//TODO: Add a button for each requests that approve or reject request
const RequestList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(RequestFilterProps.FILTER, {
        pageIndex: 1,
        size: "5",
        filterStatus: "None",
        filterType: "None",
        filterSearchBrand: "",
        filterSearchBrandId: "None",
        filterSearchShop: "",
        filterSearchShopId: "None",
        filterSearchEdgeBox: "",
        filterSearchEdgeBoxId: "None",
        filterSearchAccount: "",
        filterSearchAccountId: "None",
        filterHasReply: true
    })

    const { pageIndex, size, filterStatus, filterType, filterHasReply,
        filterSearchBrand, filterSearchBrandId, filterSearchShop, filterSearchShopId,
        filterSearchEdgeBox, filterSearchEdgeBoxId, filterSearchAccount, filterSearchAccountId } = storage;

    const [opened, { toggle }] = useDisclosure(false);
    const [rendered, setRendered] = useState(0)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: requestList, isFetching, isLoading, refetch
    } = useGetAllRequests({
        pageIndex: (pageIndex - 1), size, hasReply: filterHasReply,
        status: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
        type: filterType !== "None" && filterType !== "" ? filterType : "",
        brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
        shopId: filterSearchShopId !== "None" && !isEmpty(filterSearchShopId) ? filterSearchShopId : "",
        accountId: filterSearchAccountId !== "None" && !isEmpty(filterSearchAccountId) ? filterSearchAccountId : "",
        edgeBoxId: filterSearchEdgeBoxId !== "None" && !isEmpty(filterSearchEdgeBoxId) ? filterSearchEdgeBoxId : "",
    })

    const { data: brandList, refetch: refetchBrand
    } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });

    const { data: shopList, refetch: refetchShop
    } = useGetAllShopsSelect({ name: filterSearchShop || "" });

    const { data: accountList, refetch: refetchAccount
    } = useGetAllAccountsSelect({ name: filterSearchAccount || "" });

    const { data: edgeBoxList, refetch: refetchEdgeBox
    } = useGetAllEdgeBoxesSelect({ name: filterSearchEdgeBox || "" });

    //Searching refresh
    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    useEffect(() => {
        const timer = setTimeout(() => refetchShop(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchShop]);

    useEffect(() => {
        const timer = setTimeout(() => refetchAccount(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchAccount]);

    useEffect(() => {
        const timer = setTimeout(() => refetchEdgeBox(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchEdgeBox]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filterStatus !== "None" || filterType !== "None" ||
                filterSearchShopId !== "None" || filterSearchBrandId !== "None" ||
                filterSearchAccountId !== "None" || filterSearchEdgeBoxId !== "None")
                && rendered !== 0) {
                refetch();
                setRendered(a => a + 1)
                setStorage(RequestFilterProps.PAGE_INDEX, 1)
            } else {
                setRendered(x => x + 1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterStatus, filterType, filterSearchShopId, filterSearchBrandId, filterSearchAccountId, filterSearchEdgeBoxId]);

    const onClearFilter = () => {
        setStorage(RequestFilterProps.FILTER_STATUS, "")
        setStorage(RequestFilterProps.FILTER_TYPE, "")
        setStorage(RequestFilterProps.FILTER_HAS_REPLY, true)
        setStorage(RequestFilterProps.FILTER_SEARCH_BRAND, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_BRAND_ID, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_SHOP, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_SHOP_ID, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_ACCOUNT, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_ACCOUNT_ID, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_EDGE_BOX, "")
        setStorage(RequestFilterProps.FILTER_SEARCH_EDGE_BOX_ID, "")
    }

    const rows = requestList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/edgebox/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>

                <Table.Td>{e.requestType}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <StatusBadge statusName={e.requestStatus ? e.requestStatus : "None"} type="request" fullWidth />
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
                        >REQUEST LIST</Text>
                        <Group>
                            <Tooltip label="Filter" withArrow>
                                <ActionIcon color="grey" size={"lg"} w={20} onClick={toggle}>
                                    <MdFilterAlt />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text>Filter Request</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mb="md" mr={50}>
                    <Text size='sm' fw={"bold"}>Has Reply: </Text>
                    <Switch
                        checked={filterHasReply}
                        onChange={(event) => setStorage(RequestFilterProps.FILTER_HAS_REPLY, event.currentTarget.checked)}
                    />
                </Group>
                <Group>
                    <Group mb="md" mr={50}>
                        <Text size='sm' fw={"bold"}>Status: </Text>
                        <RadioGroup name="status" value={filterStatus}
                            onChange={(value) => setStorage(RequestFilterProps.FILTER_STATUS, value)}>
                            <Group>
                                <Radio value={RequestStatus.Open.toString()} label={"Open"} />
                                <Radio value={RequestStatus.Canceled.toString()} label={"Canceled"} />
                                <Radio value={RequestStatus.Done.toString()} label={"Done"} />
                                <Radio value={RequestStatus.Rejected.toString()} label={"Rejected"} />
                            </Group>
                        </RadioGroup>
                    </Group>
                    <Group mb="md">
                        <Text size='sm' fw={"bold"}>Type: </Text>
                        <RadioGroup name="location" value={filterType}
                            onChange={(value) => setStorage(RequestFilterProps.FILTER_TYPE, value)}>
                            <Group>
                                <Radio value={RequestType.Install.toString()} label={"Install"} />
                                <Radio value={RequestType.Remove.toString()} label={"Remove"} />
                                <Radio value={RequestType.Repair.toString()} label={"Repair"} />
                                <Radio value={RequestType.Other.toString()} label={"Other"} />
                            </Group>
                        </RadioGroup>
                    </Group>
                </Group>
                <Group>
                    <Group mt="md" mb="md" mr={50}>
                        <Text size='sm' fw={"bold"}>Brand: </Text>
                        <Select data={brandList || []} limit={5} size='sm'
                            nothingFoundMessage={brandList && "Not Found"}
                            value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchBrand}
                            onSearchChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_BRAND, value)}
                            onChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_BRAND_ID, value)}
                        />
                    </Group>
                    <Group mt="md" mb="md">
                        <Text size='sm' fw={"bold"}>Shop: </Text>
                        <Select data={shopList || []} limit={5} size='sm'
                            nothingFoundMessage={shopList && "Not Found"}
                            value={filterSearchShopId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchShop}
                            onSearchChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_SHOP, value)}
                            onChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_SHOP_ID, value)}
                        />
                    </Group>
                </Group>
                <Group>
                    <Group mt="md" mb="md" mr={50}>
                        <Text size='sm' fw={"bold"}>Account: </Text>
                        <Select data={accountList || []} limit={5} size='sm'
                            nothingFoundMessage={accountList && "Not Found"}
                            value={filterSearchAccountId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchAccount}
                            onSearchChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_ACCOUNT, value)}
                            onChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_ACCOUNT_ID, value)}
                        />
                    </Group>
                    <Group mt="md" mb="md">
                        <Text size='sm' fw={"bold"}>Edge Box: </Text>
                        <Select data={edgeBoxList || []} limit={5} size='sm'
                            nothingFoundMessage={edgeBoxList && "Not Found"}
                            value={filterSearchEdgeBoxId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchEdgeBox}
                            onSearchChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_EDGE_BOX, value)}
                            onChange={(value) => setStorage(RequestFilterProps.FILTER_SEARCH_EDGE_BOX_ID, value)}
                        />
                    </Group>
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
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                        {requestList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || requestList?.totalCount ?
                    <>
                        <Pagination total={requestList?.totalCount ? Math.ceil(requestList.totalCount / Number(size)) : 0} value={pageIndex} mt="sm"
                            onChange={(value) => setStorage(RequestFilterProps.PAGE_INDEX, value)} />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setStorage(RequestFilterProps.PAGE_INDEX, 1)
                                    setStorage(RequestFilterProps.SIZE, value)
                                }}
                                allowDeselect={false}
                                placeholder="0" value={size}
                                data={['5', '10', '15', '20']} defaultValue={"5"}
                            />
                        </Group>
                    </> :
                    <></>
                }
            </div>
        </>
    );
}

export default RequestList;