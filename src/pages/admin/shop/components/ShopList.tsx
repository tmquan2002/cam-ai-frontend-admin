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
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/shop.module.scss";

const ShopList = () => {
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const [searchBy, setSearchBy] = useState<string | null>("Name")
    const [clear, setClear] = useState(false)
    const [opened, { toggle }] = useDisclosure(false);

    const [filterStatus, setFilterStatus] = useState<string>("0")
    const [filterSearchBrand, setFilterSearchBrand] = useState<string>("")
    const [filterSearchBrandId, setFilterSearchBrandId] = useState<string | null>("")

    const [initialData, setInitialData] = useState(true)

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
        statusId: filterStatus !== "0" && filterStatus !== "" ? filterStatus : "",
        brandId: filterSearchBrandId ? filterSearchBrandId : "",
    });

    const { data: brandList, refetch: refetchBrand
    } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });


    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch();
        }
    }, [searchTerm, clear])

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filterStatus !== "0") {
                refetch();
                setPageIndex(1)
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
            } else {
                setPageIndex(1);
            }
            setInitialData(false)
        }
    }

    const onClearFilter = () => {
        setFilterStatus("")
        setFilterSearchBrandId("")
        setFilterSearchBrand("")
    }

    const onClearSearch = () => {
        if (initialData) {
            setSearchTerm("")
            return
        } else {
            onClearFilter();
            setSearchTerm("")
            setPageIndex(1)
            setInitialData(true)
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
                    <StatusBadge statusName={e.shopStatus?.name ? e.shopStatus?.name : "None"} type="shop"
                        statusId={e.shopStatus?.id ? e.shopStatus?.id : 0} fullWidth />
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
                            value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                            onKeyDown={onSearch}
                        />
                        <Group>
                            <Text>Search by: </Text>
                            <Select
                                placeholder="Select"
                                allowDeselect={false}
                                value={searchBy}
                                data={['Name', 'Phone']}
                                onChange={setSearchBy}
                            />
                        </Group>
                    </Group>
                </Grid.Col>

            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text fw={"bold"}>Filter Shop</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mt="md">
                    <Text size='sm'>Status: </Text>
                    <RadioGroup name="status" size='sm' value={filterStatus} onChange={setFilterStatus}>
                        <Group>
                            <Radio value={ShopStatus.Active.toString()} label={"Active"} />
                            <Radio value={ShopStatus.Inactive.toString()} label={"Inactive"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mt="md" mb="md">
                    <Text size='sm'>Brand: </Text>
                    <Select data={brandList || []} limit={5} size='sm'
                        nothingFoundMessage={brandList && "Not Found"}
                        value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                        searchValue={filterSearchBrand}
                        onSearchChange={setFilterSearchBrand}
                        onChange={setFilterSearchBrandId}
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
                        <Pagination total={shopList?.totalCount ? Math.ceil(shopList.totalCount / Number(size)) : 0} value={pageIndex} onChange={setPageIndex} mt="sm" />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setSize(value)
                                    setPageIndex(1)
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