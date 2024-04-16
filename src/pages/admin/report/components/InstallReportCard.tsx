import { Box, Group, LoadingOverlay, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { useGetAllInstalls } from "../../../../hooks/useEdgeBoxInstalls";
import styled from "../dashboard.module.scss";

export const InstallReportCard = () => {
    const { data: InstallList, isLoading: isLoadingInstall } = useGetAllInstalls();

    return (
        <Box className={styled["static-card"]} pos={"relative"}>
            <LoadingOverlay visible={isLoadingInstall} overlayProps={{ radius: "sm", blur: 2 }} />
            <p className={styled["static-card-title"]}>Install Count</p>
            <Group grow mb={15}>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>All</Text>
                    {InstallList?.totalCount ?
                        <Link to="/edgebox" className={styled["static-card-link"]}>{InstallList?.totalCount}</Link> :
                        <Text fz={20} fw={500}>No Data</Text>
                    }
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>New</Text>
                    {/* {InstallList?.values ?
                        <Link to="/edgebox" className={styled["static-card-link"]}>
                            {InstallList?.values.filter(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).length}
                        </Link> :
                        <Text fz={30} fw={500}>No Data</Text>
                    } */}
                    <Text fz={20} fw={500}>No Data</Text>
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Working</Text>
                    {/* {InstallList?.values ?
                        <Link to="/edgebox" className={styled["static-card-link"]}>
                            {InstallList?.values?.filter(e => e.edgeBoxInstallStatus === EdgeBoxInstallStatus.Disabled).length}
                        </Link> :
                        <Text fz={30} fw={500}>No Data</Text>
                    } */}
                    <Text fz={20} fw={500}>No Data</Text>
                </Box>
            </Group>
            <Group grow mb={15}>

                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Unhealthy</Text>
                    {/* {InstallList?.values ?
                        <Link to="/edgebox" className={styled["static-card-link"]}>
                            {InstallList?.values.filter(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).length}
                        </Link> :
                        <Text fz={30} fw={500}>No Data</Text>
                    } */}
                    <Text fz={20} fw={500}>No Data</Text>
                </Box>
                <Box>
                    <Text size="lg" c={"dimmed"} fw={500}>Disabled</Text>
                    {/* {InstallList?.values ?
                        <Link to="/edgebox" className={styled["static-card-link"]}>
                            {InstallList?.values?.filter(e => e.edgeBoxInstallStatus === EdgeBoxInstallStatus.Disabled).length}
                        </Link> :
                        <Text fz={30} fw={500}>No Data</Text>
                    } */}
                    <Text fz={20} fw={500}>No Data</Text>
                </Box>
            </Group>
        </Box>
    );
};