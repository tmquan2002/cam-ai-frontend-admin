import { LineChart } from "@mantine/charts";
import { ActionIcon, Box, Card, Flex, Grid, Group, Menu, Text, ThemeIcon, rem } from "@mantine/core";
import { IconDots, IconEye, IconFileZip, IconList, IconTrash, } from "@tabler/icons-react";
import * as _ from "lodash";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import styled from "./styles/dashboard.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard"
    }
]

const data = [
    {
        date: "Mar 22",
        Apples: 2890,
        Oranges: 2338,
        Tomatoes: 2452,
    },
    {
        date: "Mar 23",
        Apples: 2756,
        Oranges: 2103,
        Tomatoes: 2402,
    },
    {
        date: "Mar 24",
        Apples: 3322,
        Oranges: 986,
        Tomatoes: 1821,
    },
    {
        date: "Mar 25",
        Apples: 3470,
        Oranges: 2108,
        Tomatoes: 2809,
    },
    {
        date: "Mar 26",
        Apples: 3129,
        Oranges: 1726,
        Tomatoes: 2290,
    },
];

const TitleAndNumberCard = () => {
    return (
        <Box className={styled["static-card"]}>
            <p className={styled["static-card-title"]}>Revenue</p>
            <p className={styled["static-card-number"]}>1000</p>
            <Flex justify={"space-between"} align={"flex-end"}            >
                <p className={styled["static-card-link"]}>View detail</p>
                <ThemeIcon
                    variant="light"
                    color={_.sample(["blue", "green", "red", "yellow"])}
                    style={{
                        height: rem(40),
                        width: rem(40),
                    }}
                >
                    <IconList
                        style={{ width: "60%", height: "60%" }}
                        stroke={1.5}
                    />
                </ThemeIcon>
            </Flex>
        </Box>
    );
};

const DashboardPage = () => {
    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["dashboard-detail"]}>
                <Box m={rem(32)}>
                    <Grid justify="space-between">
                        {[1, 2, 3, 4].map((item) => (
                            <Grid.Col span={3} key={item} >
                                <TitleAndNumberCard />
                            </Grid.Col>
                        ))}
                    </Grid>
                    <Card my={rem(32)} className={styled["chart"]}>
                        <Card.Section withBorder inheritPadding>
                            <Group justify="space-between" my={rem(20)}>
                                <Text fw={500}>Static values</Text>
                                <Menu withinPortal position="bottom-end" shadow="sm">
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="gray">
                                            <IconDots style={{ width: rem(16), height: rem(16) }} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<IconFileZip style={{ width: rem(14), height: rem(14) }} />}>
                                            Download zip
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                                            Preview all
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />} color="red">
                                            Delete all
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        </Card.Section>
                        <LineChart h={300} data={data} dataKey="date" tooltipAnimationDuration={200} py={rem(40)}
                            series={[
                                { name: "Apples", color: "indigo.6" },
                                { name: "Oranges", color: "blue.6" },
                                { name: "Tomatoes", color: "teal.6" },
                            ]}
                        />
                    </Card>
                </Box>
            </div>
        </div>
    );
};

export default DashboardPage;
