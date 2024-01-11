import { Image, Loader, Pagination, Table } from '@mantine/core';
import { UseQueryResult, useQuery } from 'react-query';
import { BrandAPI, GetBrandsPagingResult } from '../../../../apis/BrandAPI';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { removeTime } from '../../../../utils/dateFormat';

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
    const [size, setSize] = useState(5)
    const navigate = useNavigate();

    const {
        data: brandList,
        isLoading,
        refetch
    } = useGetAllBrands({ pageIndex, size });

    const rows = brandList?.values.map((e, i) => (
        <Table.Tr key={e.id} onClick={() => navigate(`/brand/${e.id}`, { replace: true })}>
            <Table.Td>{(i + 1)}</Table.Td>
            <Table.Td>
                <Image w={100} h={100}
                    src={e.logoUri ? e.logoUri : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                />
            </Table.Td>
            <Table.Td>{e.name}</Table.Td>
            <Table.Td>{removeTime(new Date(e.createdDate))}</Table.Td>
            <Table.Td>{e.brandStatus !== null ? e.brandStatus.name : "None"}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>No.</Table.Th>
                            <Table.Th>Logo</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{isLoading ? loadingData : rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            {/* //TODO: Hide when total page is higher than 1 */}
            {brandList?.totalCount && Math.ceil(brandList.totalCount / size) > 0 &&
                <Pagination total={Math.ceil(brandList.totalCount / size)} value={pageIndex} onChange={setPageIndex} mt="sm" />
            }
        </>
    );
}

export default BrandList;