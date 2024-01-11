import { Autocomplete, Badge, Group, Image, Loader, Pagination, Select, Table, Text, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/brand.module.scss";
import { MdOutlineSearch } from 'react-icons/md';

const loadingData = [...Array(5)].map((_, i) => (
    <Table.Tr key={i}>
        <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
    </Table.Tr>
))

const BrandList = () => {
    const [pageIndex, setPageIndex] = useState(0)
    const [size, setSize] = useState<string | null>("5")
    const navigate = useNavigate();

    useEffect(() => {
        refetch();
    }, [size, pageIndex])

    const {
        data: brandList,
        isLoading,
        isFetching,
        refetch
    } = useGetAllBrands({ pageIndex, size });

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow>
            <Table.Tr key={e.id} onClick={() => navigate(`/brand/${e.id}`, { replace: true })}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>
                    <Image w={100} h={100}
                        src={e.logoUri ? e.logoUri : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                    />
                </Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate))}</Table.Td>
                <Table.Td>
                    <Badge size='lg' radius={"lg"} color="yellow">
                        {e.brandStatus !== null ? e.brandStatus.name : "None"}
                    </Badge>
                </Table.Td>
            </Table.Tr>
        </Tooltip>
    ));

    return (
        <>
            <div className={styled["table-header"]}>
                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.9"}>BRAND LIST</Text>
                <Autocomplete style={{ marginBottom: '20px' }}
                    placeholder="Search"
                    leftSection={<MdOutlineSearch />}
                    data={['Huy Brand', 'Test Brand']}
                />
            </div>
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Logo</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            {/* //TODO: Hide when total page is higher than 1 */}
            <div className={styled["table-footer"]}>
                {brandList?.totalCount && Math.ceil(brandList.totalCount / Number(size)) > 0 &&
                    <>
                        <Pagination total={Math.ceil(brandList.totalCount / Number(size))} value={(pageIndex + 1)} onChange={setPageIndex} mt="sm" />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={setSize} placeholder="0"
                                data={['3', '5', '8', '10']} defaultValue={"5"}
                            />
                        </Group>
                    </>
                }
            </div>
        </>
    );
}

export default BrandList;