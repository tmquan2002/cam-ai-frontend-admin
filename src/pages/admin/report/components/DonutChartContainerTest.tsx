import { Box, Skeleton, rem } from "@mantine/core";
import { useGetEdgeBoxReport } from "../../../../hooks/useReports";

import { ArcElement, Chart as ChartJS, Legend, Tooltip, TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    title: "Edge Box",
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderWidth: 1,
        },
    ],
};

const options = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'right' as const,
            labels: {
                font: {
                    size: 10, // Adjust the font size to make the legend smaller
                },
            },
        },
        tooltip: {
            callbacks: {
                label: function (context: TooltipItem<'doughnut'>) {
                    let label = context.label || '';
                    let value = context.raw as number || 0;
                    let total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                    let percentage = ((value / total) * 100).toFixed(2) + '%';
                    return `${label}: ${value} (${percentage})`;
                }
            }
        }
    } 
};

export const DonutChartContainerTest = () => {

    const { data: edgeBoxReport, isLoading: isLoadingEdgeBox } = useGetEdgeBoxReport();
    return (
        <Skeleton visible={isLoadingEdgeBox}>
            {/* <Box p={rem(32)}>
                <Group justify="center" mt={15}>
                    <Box>
                        <Text size="lg" fw={"bold"}>Edge Box Status</Text>
                        <DonutChart withLabelsLine={false} withLabels paddingAngle={5}
                            data={convertReportResponseToChartFormat(edgeBoxReport, undefined, "edgeBoxStatus")}
                        />
                    </Box>
                </Group>
            </Box> */}
            <Box py={rem(32)} px={rem(16)}>
                <Doughnut data={data} options={options} redraw/>
            </Box>
        </Skeleton>
    );
};