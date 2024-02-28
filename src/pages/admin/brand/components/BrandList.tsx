import { ActionIcon, Avatar, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { BrandStatus } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/brand.module.scss";
import { isEmpty } from 'lodash';

const BrandList = () => {
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const [clear, setClear] = useState(false)
    const [opened, { toggle }] = useDisclosure(false);
    const [filterStatus, setFilterStatus] = useState<string>("None")

    const [initialData, setInitialData] = useState(true)

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
            } else {
                setPageIndex(1);
            }
            setInitialData(false)
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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filterStatus !== "None") {
                refetch();
                setPageIndex(1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterStatus]);

    const onClearFilter = () => {
        setFilterStatus("")
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

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/brand/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>

                <Table.Td>
                    <Group>
                        <Avatar w={50} h={50} src={e.logoUri} />{e.name}
                    </Group></Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <StatusBadge statusName={e.brandStatus ? e.brandStatus : "None"} type="brand" fullWidth />
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
                            value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                            onKeyDown={onSearch}
                        />
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text fw={"bold"}>Filter Brand</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mb="md">
                    <Text size='sm'>Status: </Text>
                    <RadioGroup name="status" value={filterStatus}
                        onChange={setFilterStatus}>
                        <Group>
                            <Radio value={BrandStatus.Active.toString()} label={"Active"} />
                            <Radio value={BrandStatus.Inactive.toString()} label={"Inactive"} />
                        </Group>
                    </RadioGroup>
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
                        <Pagination total={brandList?.totalCount ? Math.ceil(brandList.totalCount / Number(size)) : 0} value={pageIndex} onChange={setPageIndex} mt="sm" />
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
                    </> :
                    <></>
                }
            </div>
        </>
    );
}

export default BrandList;