import { Image, Loader, Table } from '@mantine/core';
import { UseQueryResult, useQuery } from 'react-query';
import { BrandAPI, GetBrandsPagingResult } from '../../../../apis/BrandAPI';
import { useState } from 'react';

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

    const {
        data: brandList,
        isLoading,
        isFetching,
        refetch
    }: UseQueryResult<GetBrandsPagingResult, Error> = useQuery(
        ["brandList", pageIndex, size],
        async () => await BrandAPI.getAllFilter({ pageIndex, size })
    );

    const rows = brandList?.values.map((e, i) => (
        <Table.Tr key={e.id}>
            <Table.Td>{(i + 1)}</Table.Td>
            <Table.Td>
                <Image w={100} h={100}
                    src={e.logoUri ? e.logoUri : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                />
            </Table.Td>
            <Table.Td>{e.name}</Table.Td>
            <Table.Td>{e.brandStatus !== null ? e.brandStatus.name : "None"}</Table.Td>
            <Table.Td>Show Detail</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={500}>
            <Table verticalSpacing={"sm"} striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>No.</Table.Th>
                        <Table.Th>Logo</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{isLoading ? loadingData : rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}

export default BrandList;