import { DonutChart } from "@mantine/charts";
import { Box, Group, Skeleton, Text } from "@mantine/core";
import styled from "../report.module.scss";
import { useGetEdgeBoxInstallReport, useGetEdgeBoxReport } from "../../../../hooks/useReports";
import { convertReportResponseToChartFormat } from "../../../../utils/chartFunction";

export const DonutChartContainer = ({ type }: { type: "edgeBox" | "install" }) => {

    const { data: edgeBoxReport, isLoading: isLoadingEdgeBox } = useGetEdgeBoxReport();
    const { data: edgeBoxInstallReport, isLoading: isLoadingEdgeBoxInstall } = useGetEdgeBoxInstallReport();
    return (
        <Skeleton visible={type == "edgeBox" ? isLoadingEdgeBox : isLoadingEdgeBoxInstall}>
            <Box className={styled["static-card"]} pos={"relative"} >
                <div className={styled["static-card-title"]}>
                    {type == "edgeBox" ? "Edge Box" : "Install"}
                </div>
                <Text size="lg" fw={"bold"}>Total: {type == "edgeBox" ? edgeBoxReport?.total : type == "install" ? edgeBoxInstallReport?.total : 0}</Text>

                <Group justify="center" mt={15}>
                    <Box>
                        <Text size="lg" fw={"bold"}>{type == "edgeBox" ? "Edge Box Status" : type == "install" ? "Install Status" : 0}</Text>
                        <DonutChart withLabelsLine withLabels
                            data={type == "edgeBox" ?
                                convertReportResponseToChartFormat(edgeBoxReport, undefined, "edgeBoxStatus")
                                : convertReportResponseToChartFormat(undefined, edgeBoxInstallReport, "installationStatus")
                            }
                        />
                    </Box>
                    
                    <Box>
                        <Text size="lg" fw={"bold"}>{type == "edgeBox" ? "Location Status" : type == "install" ? "Activation Status" : 0}</Text>
                        <DonutChart withLabelsLine withLabels
                            data={type == "edgeBox" ?
                                convertReportResponseToChartFormat(edgeBoxReport, undefined, "locationStatus")
                                : convertReportResponseToChartFormat(undefined, edgeBoxInstallReport, "activationStatus")
                            }
                        />
                    </Box>
                </Group>
            </Box>
        </Skeleton>
    );
};