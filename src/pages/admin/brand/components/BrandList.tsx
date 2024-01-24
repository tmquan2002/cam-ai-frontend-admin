import { ActionIcon, Avatar, Badge, Button, Group, Loader, Modal, Pagination, Select, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { MdAdd, MdClear, MdFilterAlt, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { NO_IMAGE_LOGO } from '../../../../constants/ImagePlaceholders';
import { useGetAllBrands } from '../../../../hooks/useBrands';
import { removeTime } from '../../../../utils/dateFormat';
import styled from "../styles/brand.module.scss";
import { BrandStatus } from '../../../../types/enum';

const BrandList = () => {
    const [pageIndex, setPageIndex] = useState(1)
    const [size, setSize] = useState<string | null>("5")
    const [searchTerm, setSearchTerm] = useState("")
    const [clear, setClear] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);

    const [filterStatus, setFilterStatus] = useState<string | null>("")
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

    const rows = brandList?.values.map((e, i) => (
        <Tooltip label="View Detail" withArrow key={e.id}>
            <Table.Tr onClick={() => navigate(`/brand/${e.id}`)}>
                <Table.Td>{(i + 1)}</Table.Td>

                <Table.Td>
                    <Group>
                        <Avatar w={50} h={50} src={e.logoUri ? e.logoUri : NO_IMAGE_LOGO} />{e.name}
                    </Group></Table.Td>
                <Table.Td>{removeTime(new Date(e.createdDate), "/")}</Table.Td>
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
            <Group mb={20} justify='space-around'>
                <TextInput w={'80%'}
                    placeholder="Search" leftSection={<MdOutlineSearch />}
                    rightSection={<MdClear onClick={() => {
                        setSearchTerm("")
                        setClear(true)
                        setPageIndex(1)
                    }} />}
                    value={searchTerm} onChange={(event) => { event.preventDefault(); setSearchTerm(event.currentTarget.value) }}
                    onKeyDown={onSearch}
                />
                <Tooltip label="Filter" withArrow>
                    <ActionIcon color="grey" size={"lg"} w={20} onClick={open}>
                        <MdFilterAlt />
                    </ActionIcon>
                </Tooltip>
                <Modal opened={opened} onClose={close} title="Filter List" centered>
                    <Select data={[
                        { value: BrandStatus.Active.toString(), label: "Active" },
                        { value: BrandStatus.Inactive.toString(), label: "Inactive" }
                    ]}
                        label="Status" placeholder="Pick value" clearable value={filterStatus} onChange={setFilterStatus}
                    />
                    <Button
                        mt={20} onClick={() => { refetch(); close(); setPageIndex(1) }}
                        variant="gradient" size="md" mb={20}
                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                    >
                        Done
                    </Button>
                </Modal>
            </Group>
            <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing={"sm"} striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Created Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{isLoading || isFetching ? loadingData : rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            <div className={styled["table-footer"]}>
                {isLoading || isFetching || brandList?.totalCount &&
                    <>
                        <Pagination total={Math.ceil(brandList.totalCount / Number(size))} value={pageIndex} onChange={setPageIndex} mt="sm" />
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

export default BrandList;