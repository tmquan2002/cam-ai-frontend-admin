import { Grid, Group, Loader, ScrollArea, Table, Text, Tooltip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../../components/badge/StatusBadge';
import { useGetAllEdgeBoxes, useGetEdgeBoxInstallsByAllEdgeBoxId } from '../../../../hooks/useEdgeBoxes';

const InstallList = () => {

    const navigate = useNavigate();

    const loadingData = [...Array(Number(3))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

    const { data: edgeBoxList, isFetching,
    } = useGetAllEdgeBoxes({})

    const queriesInstallData = useGetEdgeBoxInstallsByAllEdgeBoxId(edgeBoxList)

    const rows = queriesInstallData?.map((query, installIndex) => (
        <Tooltip label="View Detail" withArrow key={query.data?.values[0].id} openDelay={1000}>
            <Table.Tr onClick={() => navigate(`/edgebox/${query.data?.values[0].edgeBox?.id}`)}>
                <Table.Td>{(installIndex + 1)}</Table.Td>

                <Table.Td>{query.data?.values[0].shop.name}</Table.Td>
                <Table.Td>{query.data?.values[0].edgeBox?.name}</Table.Td>
                <Table.Td>
                    <StatusBadge statusName={query.data?.values[0].edgeBoxInstallStatus ? query.data?.values[0].edgeBoxInstallStatus : "None"} fullWidth />
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
                        >EDGE BOX INSTALLATION LIST</Text>
                    </Group>
                </Grid.Col>
            </Grid>

            {/* Table */}
            <ScrollArea.Autosize mah={400}>
                <Table.ScrollContainer minWidth={500} p={10}>
                    <Table verticalSpacing={"sm"} striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Shop Name</Table.Th>
                                <Table.Th>EdgeBox Name</Table.Th>
                                <Table.Th ta={"center"}>Install Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{isFetching || queriesInstallData.every(a => a.isFetching) ? loadingData : rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
        </>
    );
}

export default InstallList;