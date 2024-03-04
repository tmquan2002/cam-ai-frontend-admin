import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllAccounts } from '../../../../hooks/useAccounts';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { AccountStatus, RoleEnum } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/account.module.scss";

const AccountList = () => {
    //Page and Size
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")

    //Search and Clear
    const [searchTerm, setSearchTerm] = useState("")
    const [searchBy, setSearchBy] = useState<string | null>("Name")
    const [clear, setClear] = useState(false)

    //Filters
    const [opened, { toggle }] = useDisclosure(false);
    const [filterRole, setFilterRole] = useState<string>("None")
    const [filterStatus, setFilterStatus] = useState<string>("None")
    const [filterSearchBrand, setFilterSearchBrand] = useState<string>("")
    const [filterSearchBrandId, setFilterSearchBrandId] = useState<string | null>("None")

    //Check data
    const [initialData, setInitialData] = useState(true)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: accountList, isLoading, isFetching, refetch
    } = useGetAllAccounts({
        pageIndex: (pageIndex - 1), size: Number(size),
        name: searchBy == "Name" ? searchTerm : "",
        email: searchBy == "Email" ? searchTerm : "",
        accountStatus: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
        role: filterRole !== "None" && filterRole !== "" ? filterRole : "",
        brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
    });

    const { data: brandList, refetch: refetchBrand
    } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });

    useEffect(() => {
        if (searchTerm !== "" || !clear) {
            return;
        } else {
            setClear(false)
            refetch();
        }
    }, [searchTerm, clear])

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filterStatus !== "None" || filterRole !== "None" || filterSearchBrandId !== "None") {
                refetch();
                setPageIndex(1)
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [filterSearchBrandId, filterRole, filterStatus]);

    const onSearch = (e: any) => {
        if (e.key == "Enter" && !isEmpty(searchTerm)) {
            if (pageIndex == 1) {
                refetch()
            } else {
                setPageIndex(1);
            }
            setInitialData(false)
        }
    }

    const onClearFilter = () => {
        setFilterRole("")
        setFilterStatus("")
        setFilterSearchBrandId("")
        setFilterSearchBrand("")
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

    const rows = accountList?.values.map((e, i) => (
        <Tooltip label="View Detail" key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/account/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.brand?.name}</Table.Td>
                <Table.Td>{e.email}</Table.Td>
                <Table.Td>{e.role.replace(/([A-Z])/g, ' $1').trim()}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <StatusBadge statusName={e.accountStatus ? e.accountStatus : "None"} type="account" fullWidth />
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
                        >ACCOUNT LIST</Text>
                        <Group>
                            <Tooltip label="Filter" withArrow>
                                <ActionIcon color="grey" size={"lg"} w={20} onClick={toggle}>
                                    <MdFilterAlt />
                                </ActionIcon>
                            </Tooltip>
                            <Button
                                onClick={() => navigate("/account/add")} variant="gradient"
                                gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                            >
                                New
                            </Button>
                        </Group>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Group justify="space-between">
                        <TextInput w={'60%'}
                            placeholder="Search" leftSection={<MdOutlineSearch />}
                            rightSection={<MdClear style={{ cursor: 'pointer' }} onClick={onClearSearch} />}
                            value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                            onKeyDown={onSearch}
                        />
                        <Group>
                            <Text>Search by: </Text>
                            <Select
                                placeholder="Select"
                                allowDeselect={false}
                                value={searchBy}
                                data={['Name', 'Email']}
                                onChange={setSearchBy}
                            />
                        </Group>
                    </Group>
                </Grid.Col>

            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={10} justify='space-between'>
                    <Grid.Col span={6}><Text fw={"bold"}>Filter Account</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Group mt="md">
                    <Text size='sm'>Role: </Text>
                    <RadioGroup name="role" size='sm' value={filterRole} onChange={setFilterRole}>
                        <Group>
                            <Radio value={RoleEnum.Technician} label={"Technician"} />
                            <Radio value={RoleEnum.BrandManager} label={"Brand Manager"} />
                            <Radio value={RoleEnum.ShopManager} label={"Shop Manager"} />
                            <Radio value={RoleEnum.Employee} label={"Employee"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mt="md">
                    <Text size='sm'>Status: </Text>
                    <RadioGroup name="status" size='sm' value={filterStatus} onChange={setFilterStatus}>
                        <Group>
                            <Radio value={AccountStatus.New} label={"New"} />
                            <Radio value={AccountStatus.Active} label={"Active"} />
                            <Radio value={AccountStatus.Inactive} label={"Inactive"} />
                        </Group>
                    </RadioGroup>
                </Group>
                <Group mt="md" mb="md">
                    <Text size='sm'>Brand: </Text>
                    <Select data={brandList || []} limit={5} size='sm'
                        nothingFoundMessage={brandList && "Not Found"}
                        value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                        searchValue={filterSearchBrand}
                        onSearchChange={setFilterSearchBrand}
                        onChange={setFilterSearchBrandId}
                    />
                </Group>
                <Divider />
            </Collapse>

            {/* Table */}
            <ScrollArea.Autosize mah={400}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover captionSide="bottom">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Brand</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Role</Table.Th>
                                <Table.Th>Created Date</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                        {accountList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || accountList?.totalCount ?
                    <>
                        <Pagination total={accountList?.totalCount ? Math.ceil(accountList?.totalCount / Number(size)) : 0} value={pageIndex} onChange={setPageIndex} mt="sm" />
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
                    </>
                    :
                    <></>
                }
            </div>
        </>
    );
}

export default AccountList;