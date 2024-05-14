import { ActionIcon, Button, Collapse, Divider, Grid, Group, Loader, Pagination, Radio, RadioGroup, ScrollArea, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import * as _ from "lodash";
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { GetAccountsParams } from '../../../../apis/AccountAPI';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllAccounts } from '../../../../hooks/useAccounts';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { useLocalStorageCustomHook } from '../../../../hooks/useStorageState';
import { AccountFilterProps, pageSizeSelect } from '../../../../types/constant';
import { AccountStatus, Role } from '../../../../types/enum';
import styled from "../styles/account.module.scss";

const AccountList = () => {

    const [storage, setStorage] = useLocalStorageCustomHook(AccountFilterProps.FILTER, {
        pageIndex: 1,
        size: "10",
        searchTerm: "",
        searchBy: "Name",
        filterRole: "None",
        filterStatus: "None",
        filterSearchBrand: "",
        filterSearchBrandId: "None"
    })

    const { pageIndex, size, searchTerm, searchBy, filterStatus, filterRole, filterSearchBrand, filterSearchBrandId } = storage;
    const [debounced] = useDebouncedValue(searchTerm, 500)
    const [opened, { toggle }] = useDisclosure(false)

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const searchParams: GetAccountsParams = useMemo(() => {
        let sb: GetAccountsParams = {
            pageIndex: (pageIndex - 1), size: Number(size),
            name: searchBy == "Name" ? debounced.toString() : "",
            email: searchBy == "Email" ? debounced.toString() : "",
            accountStatus: filterStatus !== "None" && filterStatus !== "" ? filterStatus : "",
            role: filterRole !== "None" && filterRole !== "" ? filterRole : "",
            brandId: filterSearchBrandId !== "None" && !isEmpty(filterSearchBrandId) ? filterSearchBrandId : "",
        };
        sb = _.omitBy(sb, _.isNil) as GetAccountsParams;
        sb = _.omitBy(sb, _.isNaN) as GetAccountsParams;
        return sb;
    }, [pageIndex, size, filterStatus, debounced, filterSearchBrandId, searchBy, filterRole]);

    const { data: accountList, isFetching } = useGetAllAccounts(searchParams);
    const { data: brandList, refetch: refetchBrand } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    const onClearFilter = () => {
        setStorage(AccountFilterProps.FILTER_ROLE, "")
        setStorage(AccountFilterProps.FILTER_STATUS, "")
        setStorage(AccountFilterProps.FILTER_SEARCH_BRAND, "")
        setStorage(AccountFilterProps.FILTER_SEARCH_BRAND_ID, "")
    }

    const rows = accountList?.values.map((e, i) => (
        <Tooltip label="View Detail" key={e.id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/account/${e.id}`)}>
                <Table.Td>{(i + 1 + Number(size) * (pageIndex - 1))}</Table.Td>
                <Table.Td c={e?.name ? "black" : "#bbbbbb"}>{e?.name ?? "No Data"}</Table.Td>
                <Table.Td c={e?.brand?.name ? "black" : "#bbbbbb"}>{e?.brand?.name ?? "No Data"}</Table.Td>
                <Table.Td c={e?.email ? "black" : "#bbbbbb"}>{e?.email ?? "No Data"}</Table.Td>
                <Table.Td c={e?.role ? "black" : "#bbbbbb"}>{e?.role ? e?.role.toString().replace(/([A-Z])/g, ' $1').trim() : "No Data"}</Table.Td>
                <Table.Td ta="center">
                    <StatusBadge statusName={e.accountStatus ? e.accountStatus : "None"} padding={10} size='sm' />
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
                        >Account List</Text>
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
                    <Group justify="space-between" align='flex-end'>
                        <TextInput w={'60%'}
                            placeholder="Search" leftSection={<MdOutlineSearch />}
                            value={searchTerm}
                            onChange={(event) => {
                                event.preventDefault();
                                setStorage(AccountFilterProps.SEARCH, event.currentTarget.value)
                            }}
                        />
                        <Group>
                            <Select
                                placeholder="Select" label="Search By"
                                allowDeselect={false}
                                value={searchBy}
                                data={['Name', 'Email']}
                                onChange={(value) => setStorage(AccountFilterProps.SEARCH_BY, value)}
                            />
                        </Group>
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Filter */}
            <Collapse in={opened}>
                <Divider />
                <Grid mt={20} justify='space-between'>
                    <Grid.Col span={6}><Text fw="bold">Filter Account</Text></Grid.Col>
                    <Grid.Col span="content"><Button variant='transparent'
                        onClick={onClearFilter}>
                        Clear All Filters
                    </Button>
                    </Grid.Col>
                </Grid>
                <Grid mb={20}>
                    <Grid.Col span={4}>
                        <RadioGroup name="role" size='sm' value={filterRole} label="Role"
                            onChange={(value) => setStorage(AccountFilterProps.FILTER_ROLE, value)}>
                            <Group>
                                <Radio value={Role.BrandManager} label={"Brand Manager"} />
                                <Radio value={Role.ShopManager} label={"Shop Manager"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <RadioGroup name="status" size='sm' value={filterStatus} label="Account Status"
                            onChange={(value) => setStorage(AccountFilterProps.FILTER_STATUS, value)}>
                            <Group>
                                <Radio value={AccountStatus.New} label={"New"} />
                                <Radio value={AccountStatus.Active} label={"Active"} />
                                <Radio value={AccountStatus.Inactive} label={"Inactive"} />
                            </Group>
                        </RadioGroup>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Select data={brandList || []} limit={5} size='xs'
                            nothingFoundMessage={brandList && "Not Found"} label="Brand"
                            value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                            searchValue={filterSearchBrand}
                            onSearchChange={(value) => setStorage(AccountFilterProps.FILTER_SEARCH_BRAND, value)}
                            onChange={(value) => setStorage(AccountFilterProps.FILTER_SEARCH_BRAND_ID, value)}
                        />
                    </Grid.Col>
                </Grid>
                <Divider />
            </Collapse>

            {/* Table */}
            <ScrollArea.Autosize mah={600}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover captionSide="bottom">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Brand</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Role</Table.Th>
                                <Table.Th ta={"center"}>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching ? loadingData : rows}</Table.Tbody>
                        {accountList?.totalCount == 0 && <Table.Caption>Nothing Found</Table.Caption>}
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
            <div className={styled["table-footer"]}>
                {isFetching || accountList?.totalCount ?
                    <>
                        <Pagination total={accountList?.totalCount ? Math.ceil(accountList?.totalCount / Number(size)) : 0} value={pageIndex} mt="sm"
                            onChange={(value) => setStorage(AccountFilterProps.PAGE_INDEX, value)} />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setStorage(AccountFilterProps.PAGE_INDEX, 1)
                                    setStorage(AccountFilterProps.SIZE, value)
                                }}
                                allowDeselect={false}
                                placeholder="0" value={size}
                                data={pageSizeSelect} defaultValue={"5"}
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