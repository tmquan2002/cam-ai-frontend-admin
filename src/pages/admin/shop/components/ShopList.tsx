import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { useGetAllShops } from '../../../../hooks/useShops';
import { ShopStatus } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateFunction';
import styled from "../styles/shop.module.scss";
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { ShopFilterProps } from '../../../../types/constant';

const ShopList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(ShopFilterProps.FILTER, {
        pageIndex: 1,
        size: "5",
        searchTerm: "",
        searchBy: "Name",
        filterStatus: "None",
        filterSearchBrand: "",
        filterSearchBrandId: "None",
        initialData: true
    })

    const { pageIndex, size, searchTerm, searchBy, initialData,
        filterStatus, filterSearchBrand, filterSearchBrandId } = storage;

    const [clear, setClear] = useState(false)
    const [opened, { toggle }] = useDisclosure(false)
    const [rendered, setRendered] = useState(0)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: shopList, isLoading, isFetching, refetch
    } = useGetAllShops({
        pageIndex: (pageIndex - 1), size: Number(size),
        name: searchBy == "Name" ? searchTerm : "",
        phone: searchBy == "Phone" ? searchTerm : "",
        status: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
        brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
    });

    const { data: brandList, refetch: refetchBrand
    } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });


    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch();
            setRendered(x => x + 1)
        }
    }, [searchTerm, clear])

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if ((filterStatus !== "None" || filterSearchBrandId !== "None") && rendered !== 0) {
                refetch()
                setRendered(x => x + 1)
                setStorage(ShopFilterProps.PAGE_INDEX, 1)
            } else {
                setRendered(x => x + 1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterSearchBrandId, filterStatus]);

    const onSearch = (e: any) => {
        // console.log(e.key)
        if (e.key == "Enter" && !isEmpty(searchTerm)) {
            if (pageIndex == 1) {
                refetch()
                setRendered(x => x + 1)
            } else {
                setStorage(ShopFilterProps.PAGE_INDEX, 1)
            }
            setStorage(ShopFilterProps.INITIAL_DATA, false)
        }
    }

    const onClearFilter = () => {
        setStorage(ShopFilterProps.FILTER_STATUS, "")
        setStorage(ShopFilterProps.FILTER_SEARCH_BRAND, "")
        setStorage(ShopFilterProps.FILTER_SEARCH_BRAND_ID, "")
    }

    const onClearSearch = () => {
        if (initialData) {
            setStorage(ShopFilterProps.SEARCH, "")
            return
        } else {
            onClearFilter();
            setStorage(ShopFilterProps.SEARCH, "")
            setStorage(ShopFilterProps.PAGE_INDEX, 1)
            setStorage(ShopFilterProps.INITIAL_DATA, true)
            setClear(true)
        }
    }

    const rows = shopList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}
            events={{ hover: true, focus: true, touch: false }}>
            <Table.Tr onClick={() => navigate(`/shop/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.brand?.name}</Table.Td>
                <Table.Td>{e.phone}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <StatusBadge statusName={e.shopStatus ? e.shopStatus : "None"} type="shop" fullWidth />
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
                        >SHOP LIST</Text>
                        <Group>
                            <Tooltip label="Filter" withArrow>
                                <ActionIcon color="grey" size={"lg"} w={20} onClick={toggle}>
                                    <MdFilterAlt />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Group justify="space-between">
                        <TextInput w={'60%'}
                            placeholder="Search" leftSection={<MdOutlineSearch />}
                            rightSection={<MdClear style={{ cursor: 'pointer' }} onClick={onClearSearch} />}
                            value={searchTerm}
                            onChange={(event) => {
                                event.preventDefault();
                                setStorage(ShopFilterProps.SEARCH, event.currentTarget.value)
                            }}
                            onKeyDown={onSearch}
                        />
                        <Group>
                            <Text>Search by: </Text>
                            <Select
                                placeholder="Select"
                                allowDeselect={false}
                                value={searchBy}
                                data={['Name', 'Phone']}
                                onChange={(value) => setStorage(ShopFilterProps.SEARCH_BY, value)}
                            />
                        </Group>
                    </Group>
                </Grid.Col>

            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text>Filter Shop</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mt="md">
                    <Text size='sm' fw={"bold"}>Status: </Text>
                    <RadioGroup name="status" size='sm' value={filterStatus}
                        onChange={(value) => setStorage(ShopFilterProps.FILTER_STATUS, value)}>
                        <Group>
                            <Radio value={ShopStatus.Active.toString()} label={"Active"} />
                            <Radio value={ShopStatus.Inactive.toString()} label={"Inactive"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mt="md" mb="md">
                    <Text size='sm' fw={"bold"}>Brand: </Text>
                    <Select data={brandList || []} limit={5} size='sm'
                        nothingFoundMessage={brandList && "Not Found"}
                        value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                        searchValue={filterSearchBrand}
                        onSearchChange={(value) => setStorage(ShopFilterProps.FILTER_SEARCH_BRAND, value)}
                        onChange={(value) => setStorage(ShopFilterProps.FILTER_SEARCH_BRAND_ID, value)}
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
                                <Table.Th>Brand</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                        {shopList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || shopList?.totalCount ?
                    <>
                        <Pagination total={shopList?.totalCount ? Math.ceil(shopList.totalCount / Number(size)) : 0} value={pageIndex} mt="sm"
                            onChange={(value) => setStorage(ShopFilterProps.PAGE_INDEX, value)} />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setStorage(ShopFilterProps.PAGE_INDEX, 1)
                                    setStorage(ShopFilterProps.SIZE, value)
                                }}
                                allowDeselect={false}
                                placeholder="0" value={size}
                                data={['5', '10', '15', '20']} defaultValue={"5"}
                            />
                        </Group>
                    </> : <></>
                }
            </div>
        </>
    );
}

export default ShopList;