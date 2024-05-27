import { ActionIcon, Avatar, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import * as _ from "lodash";
import { useMemo } from 'react';
import { MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GetBrandsParams } from '../../../../apis/BrandAPI';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { BrandFilterProps, PAGE_SIZE_DEFAULT, PAGE_SIZE_SELECT } from '../../../../types/constant';
import { BrandStatus } from '../../../../types/enum';
import styled from "../styles/brand.module.scss";

const BrandList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(BrandFilterProps.FILTER, {
        pageIndex: 1,
        size: PAGE_SIZE_DEFAULT,
        searchTerm: "",
        filterStatus: "None",
    })

    const { pageIndex, size, searchTerm, filterStatus } = storage;
    const [debounced] = useDebouncedValue(searchTerm, 500)
    const [opened, { toggle }] = useDisclosure(false);

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

    const searchParams: GetBrandsParams = useMemo(() => {
        let sb: GetBrandsParams = {
            pageIndex: (pageIndex - 1), size, name: debounced.toString(),
            brandStatus: filterStatus !== "None" && filterStatus !== "" ? filterStatus : ""
        };
        sb = _.omitBy(sb, _.isNil) as GetBrandsParams;
        sb = _.omitBy(sb, _.isNaN) as GetBrandsParams;
        return sb;
    }, [pageIndex, size, filterStatus, debounced]);

    const { data: brandList, isFetching } = useGetAllBrands(searchParams)


    const onClearFilter = () => {
        setStorage(BrandFilterProps.FILTER_STATUS, "");
    }

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/brand/${e.id}`)}>
                <Table.Td>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>
                <Table.Td>
                    <Group>
                        <Avatar w={50} h={50} src={e.logo?.hostingUri} />{e.name}
                    </Group>
                </Table.Td>
                <Table.Td c={e?.email ? undefined : "#bbbbbb"}>{e?.email ?? "No Data"}</Table.Td>
                <Table.Td c={e?.phone ? undefined : "#bbbbbb"}>{e?.phone ?? "No Data"}</Table.Td>
                <Table.Td ta="center">
                    <StatusBadge statusName={e.brandStatus ? e.brandStatus : "None"} padding={10} size='sm' />
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
                        >Brand List</Text>
                        <Group>
                            <Tooltip label="Filter" withArrow>
                                <ActionIcon color="grey" size={"lg"} w={20} onClick={toggle}>
                                    <MdFilterAlt />
                                </ActionIcon>
                            </Tooltip>
                            <Button
                                onClick={() => navigate("/brand/add")} variant="gradient"
                                gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                            >
                                New
                            </Button>
                        </Group>
                    </Group>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Group justify="space-between" align='flex-end'>
                        <TextInput w={'100%'}
                            placeholder="Search" leftSection={<MdOutlineSearch />}
                            value={searchTerm}
                            onChange={(event) => {
                                event.preventDefault();
                                setStorage(BrandFilterProps.SEARCH, event.currentTarget.value);
                            }}
                        />
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter Section*/}
            <Collapse in={opened}>
                <Divider />
                <Grid my={10} align='flex-end'>
                    <Grid.Col span={3}>
                        <RadioGroup name="status" value={filterStatus} label="Brand Status" size='xs'
                            onChange={(value) => setStorage(BrandFilterProps.FILTER_STATUS, value)}>
                            <Group>
                                <Radio value={BrandStatus.Active.toString()} label={"Active"} />
                                <Radio value={BrandStatus.Inactive.toString()} label={"Inactive"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={3} ta="right">
                        <Button variant='transparent'
                            onClick={onClearFilter}>
                            Clear All Filters
                        </Button>
                    </Grid.Col>
                </Grid>
                <Divider />
            </Collapse>

            {/* Table Section*/}
            <ScrollArea.Autosize mah={600}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                        {brandList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isFetching || brandList?.totalCount ?
                    <>
                        <Pagination total={brandList?.totalCount ? Math.ceil(brandList.totalCount / Number(size)) : 0}
                            value={pageIndex} mt="sm"
                            onChange={(value) => setStorage(BrandFilterProps.PAGE_INDEX, value)} />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setStorage(BrandFilterProps.SIZE, value);
                                    setStorage(BrandFilterProps.PAGE_INDEX, 1);
                                }}
                                allowDeselect={false}
                                placeholder="0" value={size}
                                data={PAGE_SIZE_SELECT}
                                defaultValue={PAGE_SIZE_DEFAULT}
                            />
                        </Group>
                    </> :
                    <></>
                }
            </div>
        </>
    );
}

export default BrandList;