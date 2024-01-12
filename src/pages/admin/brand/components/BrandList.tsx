import { Autocomplete, Badge, Button, Group, Image, Loader, Pagination, Select, Table, Text, Tooltip } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/brand.module.scss";
import { MdAdd, MdOutlineSearch } from 'react-icons/md';
import { NO_IMAGE_LOGO } from '../../../../constants/ImagePlaceholders';

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
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();

    const onSizeChange = useCallback(() => {
        setPageIndex(1);
    }, [size, pageIndex]);

    const onSearch = useCallback((value: string) => {
        // setSearchTerm(value);
        console.log(value)
    }, [searchTerm]);

    useEffect(() => {
        refetch();
        // console.log(size)
        // console.log(pageIndex)
        // console.log(brandList)
    }, [onSizeChange])

    useEffect(() => {
        onSizeChange()
    }, [size])

    const {
        data: brandList,
        isLoading,
        isFetching,
        refetch
    } = useGetAllBrands({ pageIndex: (pageIndex - 1), size, name: searchTerm });

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id}>
            <Table.Tr onClick={() => navigate(`/brand/${e.id}`, { replace: true })}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>
                    <Image w={70} h={70} src={e.logoUri ? e.logoUri : NO_IMAGE_LOGO} />
                </Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate))}</Table.Td>
                <Table.Td>
                    <Badge size='lg' radius={"lg"} color="light-yellow.7">
                        {e.brandStatus ? e.brandStatus.name : "None"}
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
                >BRAND LIST</Text>
                <Button
                    onClick={() => navigate("/brand/add")}
                    variant="gradient" size="md" leftSection={<MdAdd />} mb={20}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Add
                </Button>
            </div>
            <Autocomplete mb={20}
                placeholder="Search" limit={5} leftSection={<MdOutlineSearch />}
                data={(isLoading || isFetching) ? [] : [... new Set(brandList?.values.map(a => a.name))]}
                value={searchTerm} onChange={setSearchTerm} onOptionSubmit={e => onSearch(e)}
            />
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
                {isLoading || isFetching || brandList?.totalCount &&
                    <>
                        <Pagination total={Math.ceil(brandList.totalCount / Number(size))} value={pageIndex} onChange={setPageIndex} mt="sm" />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={setSize} placeholder="0" value={size}
                                data={['2', '3', '5', '8']} defaultValue={"5"}
                            />
                        </Group>
                    </>
                }
            </div>
        </>
    );
}

export default BrandList;