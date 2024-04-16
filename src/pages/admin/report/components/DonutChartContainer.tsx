import { Box, Group } from "@mantine/core";
import styled from "../dashboard.module.scss";
import { DonutChart } from "@mantine/charts";

const data = [
    { name: 'USA', value: 400, color: 'indigo.6' },
    { name: 'India', value: 300, color: 'yellow.6' },
    { name: 'Japan', value: 100, color: 'teal.6' },
    { name: 'Other', value: 200, color: 'gray.6' },
];
export const DonutChartContainer = () => {
    // const { data: edgeBoxList, isLoading: isLoadingEdgeBox } = useGetAllEdgeBoxes({ size: 100 });

    return (
        <Box className={styled["static-card"]} pos={"relative"} >
            {/* <LoadingOverlay visible={isLoadingEdgeBox} overlayProps={{ radius: "sm", blur: 2 }} /> */}
            <p className={styled["static-card-title"]}>Edge Box Count</p>
            <Group justify="center">
                <DonutChart withLabelsLine withLabels data={data} />
            </Group>
        </Box>
    );
};