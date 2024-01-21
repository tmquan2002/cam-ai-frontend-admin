import { ActionIcon, Box, Divider, Group, Image, Indicator, Popover, Text, Tooltip } from "@mantine/core"
import { useState } from "react";
import { MdNotifications, MdQueryBuilder } from "react-icons/md"
import { timeSince } from "../../utils/dateFormat";
import { NO_IMAGE_LOGO } from "../../constants/ImagePlaceholders";

const NotificationCard = ({ message, date }: { message: string, date: Date }) => {
    return (
        <Box pb={10}>
            <Group>
                <Image w={30} src={NO_IMAGE_LOGO} />
                <Box>
                    <Text size="sm">{message}</Text>
                    <Group pb={10} gap={"xs"}>
                        <MdQueryBuilder />
                        <Text size="xs" >{timeSince(date)}</Text>
                    </Group>
                </Box>
            </Group>
            <Divider />
        </Box>
    )
}
export const NotificationButton = () => {
    const [openedNotification, setOpenedNotification] = useState(false);

    return (
        <Popover opened={openedNotification}
            onChange={setOpenedNotification} zIndex={10}
            position="bottom" shadow="md"
            offset={{ mainAxis: 10, crossAxis: -100 }}>

            <Tooltip label="Notification" withArrow>
                <Popover.Target>
                    <Indicator size={12} color="pale-red.6">
                        <ActionIcon
                            onClick={() => setOpenedNotification(!openedNotification)}
                            variant="default" size="xl" aria-label="Logout"
                        >
                            <MdNotifications style={{ width: 18, height: 18 }} />
                        </ActionIcon>
                    </Indicator>
                </Popover.Target>
            </Tooltip>

            <Popover.Dropdown>
                <NotificationCard message="New request from brandmanager1" date={new Date("2024/01/20")} />
                <NotificationCard message="New request from test manager" date={new Date("2024/01/21")} />
                <NotificationCard message="New request from New new manager" date={new Date("2024/01/10")} />
                <NotificationCard message="New request from New new manager" date={new Date("2024/01/22")} />
                <NotificationCard message="New request from New new manager" date={new Date("2023/01/10")} />
            </Popover.Dropdown>
        </Popover>
    )
}