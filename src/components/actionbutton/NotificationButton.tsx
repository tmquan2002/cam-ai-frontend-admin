import { ActionIcon, Avatar, Box, Center, Divider, Flex, Indicator, Popover, ScrollArea, Tabs, Text, Tooltip, rem } from "@mantine/core";
import { useState } from "react";
import { MdNotifications } from "react-icons/md";
import { timeSince } from "../../utils/dateFormat";
import styled from "./Notification.module.scss";

const TabsHeader = ({ active, number, text, }: { text: string; number: number; active: boolean; }) => {
    return (
        <Flex justify={"center"} align={"center"}>
            <Text fw={500} tt={"capitalize"} c={active ? "blue" : "dimmed"} size="md" mr={rem(8)}>
                {text}
            </Text>
            <Center className={active ? styled["tabnumber-active"] : styled["tabnumber"]}
                px={rem(7)} py={rem(2)}
            >
                <Text size="xs">{number}</Text>
            </Center>
        </Flex>
    );
};

const NotificationCard = ({ type, role, name, date }: { type: string, role: string, name: string, date: Date }) => {
    return (
        <>
            <Flex p={20} className={styled["detail-card"]}>
                <Avatar mr={16} color="indigo"
                    style={{ cursor: "pointer", boxShadow: "0 0 3px 0 rgba(34, 34, 34, 1)", transition: "box-shadow 100ms", }}
                    src={""}
                />
                <Box>
                    {role == "technician" ?
                        <Text>New edge box {type} by <span><b>{name}</b></span></Text>
                        :
                        <Text>New {type} from <span><b>{name}</b></span></Text>
                    }
                    <Flex align={"center"}>
                        <Text c="dimmed" fw={500} size="sm">
                            {timeSince(date)}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
            <Divider />
        </>
    )
}
export const NotificationButton = () => {
    const [openedNotification, setOpenedNotification] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>("all");

    return (
        <Popover opened={openedNotification}
            onChange={setOpenedNotification} zIndex={10}
            position="bottom" shadow="md" withArrow
            offset={{ mainAxis: 10, crossAxis: -230 }}>

            <Tooltip label="Notification" withArrow>
                <Popover.Target>
                    <Indicator size={5} color="pale-red.6">
                        <ActionIcon
                            onClick={() => setOpenedNotification(!openedNotification)}
                            variant="default" size="md" aria-label="Logout"
                        >
                            <MdNotifications style={{ width: 18, height: 18 }} />
                        </ActionIcon>
                    </Indicator>
                </Popover.Target>
            </Tooltip>

            <Popover.Dropdown className={styled["popover-noti"]}>
                <ScrollArea w={rem(500)} h={550}>
                    <Flex justify={"space-between"} align={"center"} mx={rem(16)} my={rem(20)}>
                        <Text fw={500} size="xl">
                            Notification
                        </Text>
                        <Center>
                            <Text c="#adb5bd" size="md">
                                Mark all as read
                            </Text>
                        </Center>
                    </Flex>
                    <Divider />
                    <Tabs value={activeTab} onChange={setActiveTab}
                        styles={{ tabLabel: { padding: rem(4), }, }}>
                        <Tabs.List>
                            <Tabs.Tab value="all">
                                <TabsHeader active={activeTab == "all"} number={10} text="All" />
                            </Tabs.Tab>
                            <Tabs.Tab value="manager">
                                <TabsHeader active={activeTab == "manager"} number={5} text="Manager" />
                            </Tabs.Tab>
                            <Tabs.Tab value="technician">
                                <TabsHeader active={activeTab == "technician"} number={5} text="Technician" />
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="all">
                            <NotificationCard type="request" role="manager" name="brandmanager1" date={new Date("2024/01/23")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2024/01/23")} />
                            <NotificationCard type="request" role="manager" name="test manager" date={new Date("2024/01/19")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2024/01/19")} />
                            <NotificationCard type="request" role="manager" name="New manager" date={new Date("2024/01/22")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2024/01/22")} />
                            <NotificationCard type="request" role="manager" name="New manager" date={new Date("2023/12/23")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2023/12/23")} />
                            <NotificationCard type="request" role="manager" name="New manager" date={new Date("2023/01/10")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2023/01/10")} />
                        </Tabs.Panel>

                        <Tabs.Panel value="manager">
                            <NotificationCard type="request" role="manager" name="brandmanager1" date={new Date("2024/01/23")} />
                            <NotificationCard type="request" role="manager" name="test manager" date={new Date("2024/01/19")} />
                            <NotificationCard type="request" role="manager" name="New manager" date={new Date("2024/01/22")} />
                            <NotificationCard type="request" role="manager" name="New manager" date={new Date("2023/12/23")} />
                            <NotificationCard type="request" role="manager" name="New manager" date={new Date("2023/01/10")} />
                        </Tabs.Panel>

                        <Tabs.Panel value="technician">
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2024/01/23")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2024/01/19")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2024/01/22")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2023/12/23")} />
                            <NotificationCard type="installed" role="technician" name="technician1" date={new Date("2023/01/10")} />
                        </Tabs.Panel>
                    </Tabs>
                </ScrollArea>

            </Popover.Dropdown>
        </Popover>
    )
}