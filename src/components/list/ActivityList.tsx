import { Badge, Box, Flex, Grid, ScrollArea, Text, ThemeIcon } from "@mantine/core"
import { CommonResponse } from "../../models/CommonResponse"
import { EdgeBoxActivity } from "../../models/EdgeBox"
import { getDateTime } from "../../utils/dateTimeFunction"

const ActivityCard = ({ activity, index }: { activity: EdgeBoxActivity, index: number }) => {
    return (
        <Grid grow m={10} justify="space-between">
            <Grid.Col span={8}>
                <Flex wrap="nowrap" align="center" justify="flex-start" gap="md">
                    <ThemeIcon>
                        <Text size="xs" fw="bold">{index + 1}</Text>
                    </ThemeIcon>
                    <Flex wrap="nowrap" gap="md" align="center">
                        <Badge variant="outline" size="md" fw={500}>{activity?.modifiedTime ? getDateTime(new Date(activity?.modifiedTime)) : "No Data"}</Badge>
                        <Box>
                            <Text fz={10} c="dimmed">Description</Text>
                            <Text fz={13} fw={500}>{activity?.description}</Text>
                        </Box>
                    </Flex>
                </Flex>
            </Grid.Col>

            <Grid.Col span={4}>
                <Text fz={10} c="dimmed">Type</Text>
                <Text fz={13} fw={500}>{activity?.type ? activity.type.toString().replace(/([A-Z])/g, ' $1').trim() : ""}</Text>
            </Grid.Col>
        </Grid>
    )
}
export const ActivityList = ({ activityList }: { activityList: CommonResponse<EdgeBoxActivity> | undefined }) => {
    if (!activityList || activityList.values.length == 0) {
        return <Text c="dimmed" w={'100%'} ta={"center"} mt={20} fs="italic">No Activity found for this installation</Text>
    } else {
        return (
            <>
                <ScrollArea h={400}>
                    {activityList.values.map((activity, index) => (
                        <ActivityCard activity={activity} key={index} index={index} />
                    ))}
                </ScrollArea>
            </>
        )
    }
}