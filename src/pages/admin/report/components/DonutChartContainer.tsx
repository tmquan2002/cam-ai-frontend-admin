import { Box, ColorSwatch, Group, RingProgress, Skeleton, Text } from "@mantine/core";
import { useGetEdgeBoxInstallReport } from "../../../../hooks/useReports";
import { convertEdgeBoxReportToRingChart } from "../../../../utils/chartFunction";
import styled from "../report.module.scss";
import { EdgeBoxInstallStatus } from "../../../../types/enum";
import { getColorFromStatusName } from "../../../../utils/helperFunction";

export const DonutChartContainer = () => {

    const { data: edgeBoxInstallReport, isLoading: isLoadingEdgeBoxInstall } = useGetEdgeBoxInstallReport();
    return (
        <Skeleton visible={isLoadingEdgeBoxInstall}>
            <Box className={styled["static-card"]} pos={"relative"} >
                <Group>
                    <RingProgress size={150} thickness={20}
                        sections={convertEdgeBoxReportToRingChart(edgeBoxInstallReport, "installationStatus")}
                    />
                    <Box>
                        <Group>
                            <ColorSwatch color={getColorFromStatusName(EdgeBoxInstallStatus.Working)} size={15} />
                            <Text>{EdgeBoxInstallStatus.Working}</Text>
                        </Group>
                        <Group>
                            <ColorSwatch color={getColorFromStatusName(EdgeBoxInstallStatus.New)} size={15} />
                            <Text>{EdgeBoxInstallStatus.New}</Text>
                        </Group>
                        <Group>
                            <ColorSwatch color={getColorFromStatusName(EdgeBoxInstallStatus.Unhealthy)} size={15} />
                            <Text>{EdgeBoxInstallStatus.Unhealthy}</Text>
                        </Group>
                        <Group>
                            <ColorSwatch color={getColorFromStatusName(EdgeBoxInstallStatus.Disabled)} size={15} />
                            <Text>{EdgeBoxInstallStatus.Disabled}</Text>
                        </Group>
                    </Box>
                </Group>
            </Box>
        </Skeleton>
    );
};