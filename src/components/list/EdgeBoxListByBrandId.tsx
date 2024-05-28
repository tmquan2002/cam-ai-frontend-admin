import { ActionIcon, Box, Grid, Group, LoadingOverlay, Paper, Text, Tooltip } from "@mantine/core";
import { MdPageview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllEdgeBoxes } from "../../hooks/useEdgeBoxes";
import { EdgeBox } from "../../models/EdgeBox";
import { removeTime } from "../../utils/dateTimeFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EdgeBoxListParam {
    brandId: string;
}

const EdgeBoxCard = ({ item }: { item: EdgeBox }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder m={5}>
            <Group mb={20} justify="space-between" wrap="nowrap">
                <Text fw={500} fz={17} truncate="end" >{item.name}</Text>
                <Tooltip label="View Edge Box" withArrow>
                    <ActionIcon variant="filled" size="md" aria-label="View Edge Box" color="light-blue.6"
                        onClick={() => navigate(`/edgebox/${item.id}`)}>
                        <MdPageview />
                    </ActionIcon>
                </Tooltip>
            </Group>

            <Grid>
                <Grid.Col span={4}>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                        <StatusBadge statusName={item?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                        <StatusBadge statusName={item?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                    </Box>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                        <Text size="md" fw={500}>{removeTime(new Date(item?.createdDate || Date.now()), "/")}</Text>
                    </Box>
                </Grid.Col>
            </Grid>
        </Paper>
    )
}
export const EdgeBoxListByBrandId = ({ brandId }: EdgeBoxListParam) => {

    const { isLoading: isLoadingEdgeBox, data: edgeBoxData, error: edgeBoxError } = useGetAllEdgeBoxes({ brandId: brandId })

    // console.log(installData)
    return (
        <Box>
            {isLoadingEdgeBox ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box>
                :
                <Box>
                    {(edgeBoxData?.values.length == 0 || edgeBoxError) ? <Text fs="italic" ta="center" c="dimmed" mt={20}>No Edge Box Found</Text> :
                        <Grid mt={20} justify="flex-start" align="stretch">
                            {edgeBoxData?.values.map((item, index) => (
                                <Grid.Col key={index} span={{ md: 12, lg: 6 }} >
                                    <EdgeBoxCard item={item} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    }
                </Box>
            }
        </Box>
    )
}