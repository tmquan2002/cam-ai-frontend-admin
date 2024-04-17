import { Box, Group, LoadingOverlay, Text, Tooltip } from "@mantine/core";
import { useGetAllInstalls } from "../../../../hooks/useEdgeBoxInstalls";
import { EdgeBoxInstallStatus } from "../../../../types/enum";
import styled from "../report.module.scss";
import { Link } from "react-router-dom";

// TODO: Change format back to CommonResponse layer
export const InstallReportCard = () => {
    const { data: InstallList, isLoading: isLoadingInstall } = useGetAllInstalls();

    return (
        <Box className={styled["static-card"]} pos={"relative"}>
            <LoadingOverlay visible={isLoadingInstall} overlayProps={{ radius: "sm", blur: 2 }} />
            <Tooltip label="View install list" withArrow>
                <Link className={styled["static-card-link"]} to="/install">Install Count</Link>
            </Tooltip>
            <Group grow mb={15}>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>All</Text>
                    <Text fz={20} fw={500}>{InstallList?.length || "No Data"}</Text>
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>New</Text>
                    <Text fz={20} fw={500}>{InstallList?.filter(e => e.edgeBoxInstallStatus === EdgeBoxInstallStatus.New).length || 0}</Text>

                    {/* <Text fz={20} fw={500}>No Data</Text> */}
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Working</Text>
                    <Text fz={20} fw={500}>{InstallList?.filter(e => e.edgeBoxInstallStatus === EdgeBoxInstallStatus.Working).length || 0}</Text>

                    {/* <Text fz={20} fw={500}>No Data</Text> */}
                </Box>
            </Group>
            <Group grow mb={15}>

                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Unhealthy</Text>
                    <Text fz={20} fw={500}>{InstallList?.filter(e => e.edgeBoxInstallStatus === EdgeBoxInstallStatus.Unhealthy).length || 0}</Text>

                    {/* <Text fz={20} fw={500}>No Data</Text> */}
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Disabled</Text>
                    <Text fz={20} fw={500}>{InstallList?.filter(e => e.edgeBoxInstallStatus === EdgeBoxInstallStatus.Disabled).length || 0}</Text>

                    {/* <Text fz={20} fw={500}>No Data</Text> */}
                </Box>
            </Group>
        </Box>
    );
};