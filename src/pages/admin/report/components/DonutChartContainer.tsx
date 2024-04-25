import { DonutChart } from "@mantine/charts";
import { Box, Group } from "@mantine/core";
import styled from "../report.module.scss";

const data = [
    { name: 'USA', value: 400, color: 'indigo.6' },
    { name: 'India', value: 300, color: 'yellow.6' },
    { name: 'Japan', value: 100, color: 'teal.6' },
    { name: 'Other', value: 200, color: 'gray.6' },
];

// const dataEdgeBoxTest = [
//     {
//         total: 0,
//         status: {
//             "additionalProp1": 0,
//             "additionalProp2": 0,
//             "additionalProp3": 0
//         },
//         "location": {
//             "additionalProp1": 0,
//             "additionalProp2": 0,
//             "additionalProp3": 0
//         }
//     }
// ]

// const dataEdgeBoxInstallTest = [
//     {
//         total: 0,
//         "status": {
//             "additionalProp1": 0,
//             "additionalProp2": 0,
//             "additionalProp3": 0
//         },
//         "location": {
//             "additionalProp1": 0,
//             "additionalProp2": 0,
//             "additionalProp3": 0
//         }
//     }
// ]

// { type }: { type?: "activationStatus" | "locationStatus" | "installationStatus" }

export const DonutChartContainer = () => {

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