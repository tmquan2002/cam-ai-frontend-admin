import { Badge, Group, Loader, Pagination, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useGetAllShops } from '../../../../hooks/useShops';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/shop.module.scss";

const ShopList = () => {
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
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

    const { data: shopList, isLoading, isFetching,
    } = useGetAllShops({ pageIndex: (pageIndex - 1), size, name: searchTerm });

    const onSearch = (e: any) => {
        // console.log(e)
        if (e.key === "Enter") {
            setPageIndex(1);
        }
    }

    const rows = shopList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id}>
            <Table.Tr onClick={() => navigate(`/shop/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.brand.name}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <Badge size='lg' radius={"lg"} color="light-yellow.7">
                        {e.shopStatus.name ? e.shopStatus.name : "None"}
                    </Badge>
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
            </div>
            <TextInput mb={20}
                placeholder="Search" leftSection={<MdOutlineSearch />}
                value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                onKeyDown={onSearch}
            />
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Brand</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || shopList?.totalCount &&
                    <>
                        <Pagination total={Math.ceil(shopList.totalCount / Number(size))} value={pageIndex} onChange={setPageIndex} mt="sm" />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setSize(value)
                                    setPageIndex(1)
                                }}
                                placeholder="0" value={size}
                                data={['2', '3', '5', '8']} defaultValue={"5"}
                            />
                        </Group>
                    </>
                }
            </div>
        </>
    );
}

export default ShopList;