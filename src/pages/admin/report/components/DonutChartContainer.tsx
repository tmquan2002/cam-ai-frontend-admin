import { Box, ColorSwatch, Group, RingProgress, Skeleton, Text } from "@mantine/core";
import { useGetEdgeBoxInstallReport } from "../../../../hooks/useReports";
import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from "../../../../types/enum";
import { InstallStatusType, convertInstallReportToRingChart } from "../../../../utils/chartFunction";
import { enumToArray, getColorFromStatusName } from "../../../../utils/helperFunction";
import styled from "../report.module.scss";

export const DonutChartContainer = ({ type }: { type: InstallStatusType }) => {

    const { data: edgeBoxInstallReport, isLoading: isLoadingEdgeBoxInstall } = useGetEdgeBoxInstallReport();
    const ringSection = convertInstallReportToRingChart(edgeBoxInstallReport, type)
    const arrayStatus = enumToArray(EdgeBoxInstallStatus)
    const arrayActivation = enumToArray(EdgeBoxActivationStatus)

    return (
        <Skeleton visible={isLoadingEdgeBoxInstall}>
            <Box className={styled["static-card"]} pos={"relative"} >
                <Group>
                    <RingProgress size={200} thickness={23} sections={ringSection}
                        label={
                            <Text fw={700} ta="center">
                                {type == "installationStatus" ? "Installation Status" : "Activation Status"}
                            </Text>
                        }
                    />
                    {type == "installationStatus" ?
                        <Box>
                            {arrayStatus.map((item, i) => (
                                <Group key={i}>
                                    <ColorSwatch color={getColorFromStatusName(item, false, true)} size={15} />
                                    <Text>{item.toString().replace(/([A-Z])/g, ' $1').trim()} :
                                        <Text span fw="bold" c="black">
                                            {" " + (ringSection.find((itemSection) => itemSection.key === item)?.valueNotPercent ?? 0)}
                                        </Text>
                                    </Text>
                                </Group>
                            ))}
                        </Box>
                        :
                        <Box>
                            {arrayActivation.map((item, i) => (
                                <Group key={i}>
                                    <ColorSwatch color={getColorFromStatusName(item, false, true)} size={15} />
                                    <Text>{item.toString().replace(/([A-Z])/g, ' $1').trim()} :
                                        <Text span fw="bold" c="black">
                                            {" " + (ringSection.find((itemSection) => itemSection.key === item)?.valueNotPercent ?? 0)}
                                        </Text>
                                    </Text>
                                </Group>
                            ))}
                        </Box>
                    }
                </Group>
            </Box>
        </Skeleton>
    );
};