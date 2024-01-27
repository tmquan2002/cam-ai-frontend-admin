import { ActionIcon, Badge, Button, Grid, Group, Loader, Modal, Pagination, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useGetAllAccounts } from '../../../../hooks/useAccounts';
import { useGetAllBrandsSelect } from '../../../../hooks/useBrands';
import { AccountStatus, RoleEnum } from '../../../../types/enum';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/account.module.scss";

const AccountList = () => {
    //TODO: Filter based on brand with delay search
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const [clear, setClear] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);

    const [filterRole, setFilterRole] = useState<string | null>("")
    const [filterStatus, setFilterStatus] = useState<string | null>("")
    const [filterSearchBrand, setFilterSearchBrand] = useState<string | null>("")
    const [filterSearchBrandId, setFilterSearchBrandId] = useState<string | null>("")

    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: accountList, isLoading, isFetching, refetch
    } = useGetAllAccounts({
        pageIndex: (pageIndex - 1), size: Number(size),
        search: searchTerm, accountStatusId: filterStatus ? filterStatus : "",
        roleId: filterRole ? filterRole : "",
        brandId: filterSearchBrandId ? filterSearchBrandId : "",
    });

    const { data: brandList, refetch: refetchBrand
    } = useGetAllBrandsSelect({ name: filterSearchBrand || "" });

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
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [filterSearchBrand]);

    const rows = accountList?.values.map((e, i) => (
        <Tooltip.Floating label="View Detail" key={e.id}>
            <Table.Tr onClick={() => navigate(`/account/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.brand?.name}</Table.Td>
                <Table.Td>{e.roles[0].name}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>
                    <Badge size='lg' radius={"lg"} color="light-yellow.7">
                        {e.accountStatus ? e.accountStatus.name : "None"}
                    </Badge>
                </Table.Td>
            </Table.Tr>
        </Tooltip.Floating>
    ));

    return (
        <>
            {/* Top */}
            <Grid mt={5} mb={20} gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }} justify='space-between'>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }} order={{ base: 1, md: 1, lg: 1 }}>
                    <Text size='lg' fw="bold" fz='25px'
                        c={"light-blue.4"}
                    >ACCOUNT LIST</Text>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 6, lg: 6 }} order={{ base: 2, md: 3, lg: 2 }}>
                    <TextInput w={'100%'}
                        placeholder="Search" leftSection={<MdOutlineSearch />}
                        rightSection={<MdClear onClick={() => {
                            setSearchTerm("")
                            setClear(true)
                            setPageIndex(1)
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
                            onClick={() => navigate("/account/add")} variant="gradient"
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            New
                        </Button>
                    </Group>
                    <Modal opened={opened} onClose={close} title="Filter List" centered>
                        <Select data={[
                            { value: RoleEnum.Technician.toString(), label: "Technician" },
                            { value: RoleEnum.BrandManager.toString(), label: "Brand Manager" },
                            { value: RoleEnum.ShopManager.toString(), label: "Shop Manager" },
                            { value: RoleEnum.Employee.toString(), label: "Employee" }
                        ]}
                            label="Role" placeholder="Pick value" clearable value={filterRole} onChange={setFilterRole}
                        />
                        <Select data={[
                            { value: AccountStatus.New.toString(), label: "New" },
                            { value: AccountStatus.Active.toString(), label: "Active" },
                            { value: AccountStatus.Inactive.toString(), label: "Inactive" }
                        ]}
                            label="Account Status" placeholder="Pick value" clearable
                            value={filterStatus} onChange={setFilterStatus}
                        />
                        <Select label="Brand" data={brandList || []} limit={5}
                            nothingFoundMessage={brandList && "Not Found"}
                            value={filterSearchBrandId} placeholder="Pick value" clearable searchable
                            onSearchChange={setFilterSearchBrand}
                            onChange={setFilterSearchBrandId}
                        />
                        <Button
                            mt={20} onClick={() => { refetch(); close(); setPageIndex(1) }}
                            variant="gradient" size="md" mb={20}
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            Done
                        </Button>
                    </Modal>
                </Grid.Col>

            </Grid>

            {/* Table */}
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Brand</Table.Th>
                            <Table.Th>Roles</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || accountList?.totalCount &&
                    <>
                        <Pagination total={Math.ceil(accountList.totalCount / Number(size))} value={pageIndex} onChange={setPageIndex} mt="sm" />
                        <Group style={{ marginTop: '12px' }}>
                            <Text>Page Size: </Text>
                            <Select
                                onChange={(value) => {
                                    setSize(value)
                                    setPageIndex(1)
                                }}
                                placeholder="0" value={size}
                                data={['2', '3', '5', '8']} defaultValue={"5"}
                            />
                        </Group>
                    </>
                }
            </div>
        </>
    );
}

export default AccountList;