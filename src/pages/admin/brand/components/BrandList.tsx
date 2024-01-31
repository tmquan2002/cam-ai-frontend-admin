import { ActionIcon, Avatar, Badge, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { NO_IMAGE_LOGO } from '../../../../constants/ImagePlaceholders';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { BrandStatus, StatusColor } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/brand.module.scss";

const BrandList = () => {
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const [clear, setClear] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);

    const [filterStatus, setFilterStatus] = useState<string>("")
    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: brandList, isLoading, isFetching, refetch
    } = filterStatus ? useGetAllBrands({ pageIndex: (pageIndex - 1), size, name: searchTerm, statusId: Number(filterStatus) }) :
            useGetAllBrands({ pageIndex: (pageIndex - 1), size, name: searchTerm });

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

    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch();
        }
    }, [searchTerm, clear])

    useEffect(() => {
        refetch(); setPageIndex(1);
    }, [filterStatus])

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/brand/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>

                <Table.Td>
                    <Group>
                        <Avatar w={50} h={50} src={e.logoUri ? e.logoUri : NO_IMAGE_LOGO} />{e.name}
                    </Group></Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <Badge size='lg' radius={"lg"} fullWidth autoContrast p={17}
                        color={e?.brandStatus?.id == BrandStatus.Active ? StatusColor.ACTIVE :
                            e?.brandStatus?.id == BrandStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                    >
                        {e.brandStatus ? e.brandStatus.name : "None"}
                    </Badge>
                </Table.Td>
            </Table.Tr>
        </Tooltip>
    ));

    return (
        <>
            {/* Top */}
            <Grid mt={5} mb={20} gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }} justify='space-between'>

                <Grid.Col span={{ base: 12, md: 6, lg: 3 }} order={{ base: 1, md: 1, lg: 1 }}>
                    <Text size='lg' fw="bold" fz='25px'
                        c={"light-blue.4"}
                    >BRAND LIST</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 6, lg: 6 }} order={{ base: 2, md: 3, lg: 2 }}>
                    <TextInput w={'100%'}
                        placeholder="Search" leftSection={<MdOutlineSearch />}
                        rightSection={<MdClear onClick={() => {
                            if (searchTerm !== "") {
                                setSearchTerm("")
                                setClear(true)
                                setPageIndex(1)
                            }
                        }} />}
                        value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                        onKeyDown={onSearch}
                    />
                </Grid.Col>

                <Grid.Col span="content" order={{ base: 3, md: 2, lg: 3 }}>
                    <Group>
                        <Tooltip label="Filter" withArrow>
                            <ActionIcon color="grey" size={"lg"} w={20} onClick={open}>
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
                </Grid.Col>
            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text fw={"bold"}>Filter Brand</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={() => {
                            if (!isEmpty(filterStatus)) {
                                setFilterStatus("")
                            }
                        }}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <RadioGroup name="status" label="Status" value={filterStatus} mb={20}
                    onChange={setFilterStatus}>
                    <Group mt="xs">
                        <Radio value={BrandStatus.Active.toString()} label={"Active"} />
                        <Radio value={BrandStatus.Inactive.toString()} label={"Inactive"} />
                    </Group>
                </RadioGroup>
                <Divider />
            </Collapse>

            {/* Table */}
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th ta={"center"}>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                    {brandList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                </Table>
            </Table.ScrollContainer>
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
                                data={['2', '3', '5', '8']} defaultValue={"5"}
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