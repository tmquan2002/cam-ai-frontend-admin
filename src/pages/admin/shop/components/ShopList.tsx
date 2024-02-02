import { Group, Loader, Pagination, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { MdClear, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllShops } from '../../../../hooks/useShops';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/shop.module.scss";

const ShopList = () => {
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const [clear, setClear] = useState(false)
    const [initialData, setInitialData] = useState(true)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: shopList, isLoading, isFetching, refetch
    } = useGetAllShops({ pageIndex: (pageIndex - 1), size, name: searchTerm });

    const onSearch = (e: any) => {
        // console.log(e.key)
        if (e.key == "Enter") {
            if (pageIndex == 1) {
                refetch()
            } else {
                setPageIndex(1);
            }
        }
    }

    const onClearSearch = () => {
        if (initialData) {
            setSearchTerm("")
            return
        } else {
            setSearchTerm("")
            setPageIndex(1)
            setInitialData(true)
            setClear(true)
        }
    }

    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch();
        }
    }, [searchTerm, clear])

    const rows = shopList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}
            events={{ hover: true, focus: true, touch: false }}>
            <Table.Tr onClick={() => navigate(`/shop/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.brand?.name}</Table.Td>
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
            <div className={styled["table-header"]}>
                <Text size='lg' fw="bold" fz='25px' mb={20}
                    c={"light-blue.4"}
                >SHOP LIST</Text>
                <TextInput mb={20} w={300}
                    placeholder="Search" leftSection={<MdOutlineSearch />}
                    rightSection={<MdClear onClick={onClearSearch} />}
                    value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                    onKeyDown={onSearch}
                />
            </div>
            <ScrollArea.Autosize mah={400}>
                <Table.ScrollContainer minWidth={500}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Brand</Table.Th>
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