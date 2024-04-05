import { Grid, Group, Loader, ScrollArea, Table, Text } from '@mantine/core';
// TODO: This install list (has Shop, edge box and 3 status)
const InstallList = () => {

    const loadingData = [...Array(Number(3))].map((_, i) => (
        <Table.Tr key={i}>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
            <Table.Td align={"center"}><Loader color="rgba(122, 122, 122, 1)" type="bars" size={'xs'} /></Table.Td>
        </Table.Tr>
    ))

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
                        <Table.Tbody>{loadingData}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </ScrollArea.Autosize>
        </>
    );
}

export default InstallList;