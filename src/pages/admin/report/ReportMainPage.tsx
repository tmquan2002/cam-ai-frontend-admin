import { Box, Grid, rem } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { DonutChartContainer } from "./components/DonutChartContainer";
import { EdgeBoxReportCard } from "./components/EdgeBoxReportCard";
import { InstallReportCard } from "./components/InstallReportCard";
import styled from "./dashboard.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Report",
    },
]

const ReportMainPage = () => {
    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <Box m={rem(32)}>
                    <Grid>
                        <Grid.Col span={6}>
                            <EdgeBoxReportCard />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <InstallReportCard />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <DonutChartContainer />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <DonutChartContainer />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <DonutChartContainer />
                        </Grid.Col>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default ReportMainPage;
