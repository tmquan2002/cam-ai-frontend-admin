import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import * as _ from "lodash";
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GetShopsParams } from '../../../../apis/ShopAPI';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { useGetAllShops } from '../../../../hooks/useShops';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { ShopFilterProps, PAGE_SIZE_SELECT, PAGE_SIZE_DEFAULT } from '../../../../types/constant';
import { ShopStatus } from '../../../../types/enum';
import styled from "../styles/shop.module.scss";

const ShopList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(ShopFilterProps.FILTER, {
        pageIndex: 1,
        size: PAGE_SIZE_DEFAULT,
        searchTerm: "",
        searchBy: "Name",
        filterStatus: "None",
        filterSearchBrand: "",
        filterSearchBrandId: "None",
    })

    const { pageIndex, size, searchTerm, searchBy, filterStatus, filterSearchBrand, filterSearchBrandId } = storage;
    const [debounced] = useDebouncedValue(searchTerm, 500)
    const [opened, { toggle }] = useDisclosure(false)

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

    const searchParams: GetShopsParams = useMemo(() => {
        let sb: GetShopsParams = {
            pageIndex: (pageIndex - 1), size: Number(size),
            name: searchBy == "Name" ? debounced.toString() : "",
            phone: searchBy == "Phone" ? debounced.toStrng() : "",
            status: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
            brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
        };
        sb = _.omitBy(sb, _.isNil) as GetShopsParams;
        sb = _.omitBy(sb, _.isNaN) as GetShopsParams;
        return sb;
    }, [pageIndex, size, filterStatus, debounced, filterSearchBrandId, searchBy]);

    const { data: shopList, isFetching } = useGetAllShops(searchParams);
    const { data: brandList, refetch: refetchBrand } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    const onClearFilter = () => {
        setStorage(ShopFilterProps.FILTER_STATUS, "")
        setStorage(ShopFilterProps.FILTER_SEARCH_BRAND, "")
        setStorage(ShopFilterProps.FILTER_SEARCH_BRAND_ID, "")
    }

    const rows = shopList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}
            events={{ hover: true, focus: true, touch: false }}>
            <Table.Tr onClick={() => navigate(`/shop/${e.id}`)}>
                <Table.Td>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>
                <Table.Td c={e?.name ? undefined : "#bbbbbb"}>{e?.name ?? "No Data"}</Table.Td>
                <Table.Td c={e?.brand?.name ? undefined : "#bbbbbb"}>{e?.brand?.name ?? "No Data"}</Table.Td>
                <Table.Td c={e?.phone ? undefined : "#bbbbbb"}>{e?.phone ?? "No Data"}</Table.Td>
                <Table.Td ta="center">
                    <StatusBadge statusName={e.shopStatus ? e.shopStatus : "None"} padding={10} size='sm' />
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
                        >Shop List</Text>
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
                            value={searchTerm}
                            onChange={(event) => {
                                event.preventDefault();
                                setStorage(ShopFilterProps.SEARCH, event.currentTarget.value)
                            }}
                        />
                        <Group>
                            <Select
                                placeholder="Select" label="Search By"
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
                <Grid my={10} align='flex-end'>
                    <Grid.Col span={4}>
                        <RadioGroup name="status" size='xs' value={filterStatus} label="Shop Status"
                            onChange={(value) => setStorage(ShopFilterProps.FILTER_STATUS, value)}>
                            <Group>
                                <Radio value={ShopStatus.Active.toString()} label={"Active"} />
                                <Radio value={ShopStatus.Inactive.toString()} label={"Inactive"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Select data={brandList || []} limit={5} size='xs' label="Brand" w={300}
                            nothingFoundMessage={brandList && "Not Found"}
                            value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchBrand}
                            onSearchChange={(value) => setStorage(ShopFilterProps.FILTER_SEARCH_BRAND, value)}
                            onChange={(value) => setStorage(ShopFilterProps.FILTER_SEARCH_BRAND_ID, value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={4} ta="right">
                        <Button variant='transparent'
                            onClick={onClearFilter}>
                            Clear All Filters
                        </Button>
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
                                <Table.Th>Brand</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                        {shopList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isFetching || shopList?.totalCount ?
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
                                data={PAGE_SIZE_SELECT}
                                defaultValue={PAGE_SIZE_DEFAULT}
                            />
                        </Group>
                    </> : <></>
                }
            </div>
        </>
    );
}

export default ShopList;