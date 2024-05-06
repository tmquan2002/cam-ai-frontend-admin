import { ActionIcon, Avatar, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { BrandStatus } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateTimeFunction';
import styled from "../styles/brand.module.scss";
import { BrandFilterProps, pageSizeSelect } from '../../../../types/constant';

const BrandList = () => {
    const [storage, setStorage] = useLocalStorageCustomHook(BrandFilterProps.FILTER, {
        pageIndex: 1,
        size: "5",
        searchTerm: "",
        filterStatus: "None",
        initialData: true
    })

    const { pageIndex, size, searchTerm, filterStatus, initialData } = storage;

    const [clear, setClear] = useState(false)
    const [opened, { toggle }] = useDisclosure(false);
    const [rendered, setRendered] = useState(0)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: brandList, isFetching, isLoading, refetch
    } = useGetAllBrands({
        pageIndex: (pageIndex - 1), size, name: searchTerm,
        brandStatus: filterStatus !== "None" && filterStatus !== "" ? filterStatus : ""
    })

    const onSearch = (e: any) => {
        // console.log(e.key)
        if (e.key == "Enter" && !isEmpty(searchTerm)) {
            if (pageIndex == 1) {
                refetch()
                setRendered(a => a + 1)
            } else {
                setStorage(BrandFilterProps.PAGE_INDEX, 1);
            }
            setStorage(BrandFilterProps.INITIAL_DATA, false);
        }
    }

    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch()
            setRendered(a => a + 1)
        }
    }, [searchTerm, clear])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filterStatus !== "None" && rendered !== 0) {
                refetch()
                setRendered(a => a + 1)
                setStorage(BrandFilterProps.PAGE_INDEX, 1);
            } else {
                setRendered(a => a + 1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterStatus]);

    const onClearFilter = () => {
        setStorage(BrandFilterProps.FILTER_STATUS, "");
    }

    const onClearSearch = () => {
        if (initialData) {
            setStorage(BrandFilterProps.SEARCH, "");
            return
        } else {
            onClearFilter();
            setStorage(BrandFilterProps.SEARCH, "");
            setStorage(BrandFilterProps.PAGE_INDEX, 1);
            setStorage(BrandFilterProps.INITIAL_DATA, false);
            setClear(true)
        }
    }

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/brand/${e.id}`)}>
                <Table.Td>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>

                <Table.Td>
                    <Group>
                        <Avatar w={50} h={50} src={e.logo?.hostingUri} />{e.name}
                    </Group></Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <StatusBadge statusName={e.brandStatus ? e.brandStatus : "None"} fullWidth />
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
                        >BRAND LIST</Text>
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
                    <Group justify="space-between">
                        <TextInput w={'100%'}
                            placeholder="Search" leftSection={<MdOutlineSearch />}
                            rightSection={<MdClear style={{ cursor: 'pointer' }} onClick={onClearSearch} />}
                            value={searchTerm} onChange={(event) => { event.preventDefault(); setStorage(BrandFilterProps.SEARCH, event.currentTarget.value); }}
                            onKeyDown={onSearch}
                        />
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter Section*/}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text>Filter Brand</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mb="md">
                    <Text size='sm' fw={"bold"}>Status: </Text>
                    <RadioGroup name="status" value={filterStatus}
                        onChange={(value) => setStorage(BrandFilterProps.FILTER_STATUS, value)}>
                        <Group>
                            <Radio value={BrandStatus.Active.toString()} label={"Active"} />
                            <Radio value={BrandStatus.Inactive.toString()} label={"Inactive"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Divider />
            </Collapse>

            {/* Table Section*/}
            <ScrollArea.Autosize mah={400}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                        {brandList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || brandList?.totalCount ?
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
                                data={pageSizeSelect} defaultValue={"5"}
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