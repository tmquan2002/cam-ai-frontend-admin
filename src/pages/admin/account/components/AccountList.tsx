import { Badge, Button, Group, Loader, Pagination, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { MdAdd, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useGetAllAccounts } from '../../../../hooks/useAccounts';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/account.module.scss";

const AccountList = () => {
    //TODO: Filter based on brand
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();

    const loadingData = [...Array(Number(size))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: accountList, isLoading, isFetching,
    } = useGetAllAccounts({ pageIndex: (pageIndex - 1), size: Number(size), search: searchTerm });

    const onSearch = (e: any) => {
        // console.log(e)
        if (e.key === "Enter") {
            setPageIndex(1);
        }
    }

    const rows = accountList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id}>
            <Table.Tr onClick={() => navigate(`/account/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>
                <Table.Td>{e.name}</Table.Td>
                <Table.Td>{e.gender}</Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
                <Table.Td>{e.roles[0].name}</Table.Td>
                <Table.Td>
                    <Badge size='lg' radius={"lg"} color="light-yellow.7">
                        {e.accountStatus ? e.accountStatus.name : "None"}
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
                >ACCOUNT LIST</Text>
                <Button
                    onClick={() => navigate("/account/add")}
                    variant="gradient" size="md" leftSection={<MdAdd />} mb={20}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Add
                </Button>
            </div>
            <TextInput mb={20}
                placeholder="Search" leftSection={<MdOutlineSearch />}
                value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                onKeyDown={onSearch}
            />
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Gender</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th>Roles</Table.Th>
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