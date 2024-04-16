import { Box, Group, LoadingOverlay, Text } from "@mantine/core";
import { useGetAllEdgeBoxes } from "../../../../hooks/useEdgeBoxes";
import { EdgeBoxStatus } from "../../../../types/enum";
import styled from "../dashboard.module.scss";

export const EdgeBoxReportCard = () => {
    const { data: edgeBoxList, isLoading: isLoadingEdgeBox } = useGetAllEdgeBoxes({ size: 100 });

    return (
        <Box className={styled["static-card"]} pos={"relative"} >
            <LoadingOverlay visible={isLoadingEdgeBox} overlayProps={{ radius: "sm", blur: 2 }} />
            <p className={styled["static-card-title"]}>Edge Box Count</p>
            <Group grow mb={15}>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>All</Text>
                    <Text fz={20} fw={500}>{edgeBoxList?.totalCount || "No Data"}</Text>
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Active</Text>
                    <Text fz={20} fw={500}>{edgeBoxList?.values ?
                        edgeBoxList?.values.filter(e => e.edgeBoxStatus === EdgeBoxStatus.Active).length
                        : "No Data"}
                    </Text>
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Inactive</Text>
                    <Text fz={20} fw={500}>{edgeBoxList?.values ?
                        edgeBoxList?.values.filter(e => e.edgeBoxStatus === EdgeBoxStatus.Inactive).length
                        : "No Data"}
                    </Text>
                </Box>
            </Group>
            <Group grow mb={15}>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Broken</Text>
                    <Text fz={20} fw={500}>{edgeBoxList?.values ?
                        edgeBoxList?.values.filter(e => e.edgeBoxStatus === EdgeBoxStatus.Broken).length
                        : "No Data"}
                    </Text>
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Disposed</Text>
                    <Text fz={20} fw={500}>{edgeBoxList?.values ?
                        edgeBoxList?.values.filter(e => e.edgeBoxStatus === EdgeBoxStatus.Disposed).length
                        : "No Data"}
                    </Text>
                </Box>
            </Group>
        </Box>
    );
};