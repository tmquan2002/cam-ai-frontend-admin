import { ActionIcon, List, Text, Tooltip } from "@mantine/core";
import { GrInstall } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { EdgeBoxInstall } from "../../models/EdgeBoxInstall";
import { removeTime } from "../../utils/dateTimeFunction";

export const ShopHistoryList = ({ disabledEdgeBoxList }: { disabledEdgeBoxList: EdgeBoxInstall[] }) => {
    const navigate = useNavigate();

    if (!disabledEdgeBoxList || disabledEdgeBoxList.length == 0) {
        return <Text c="dimmed" w={'100%'} ta={"center"} mt={20} fs="italic">Log empty</Text>
    } else {
        return (
            <List ta={"left"} spacing="sm" size="md" pl={20} pt={10}>
                {disabledEdgeBoxList.map((install, index) => (
                    <List.Item key={index} icon={
                        <Tooltip label="View Installation" withArrow>
                            <ActionIcon variant="filled" size="lg" aria-label="View Installation"
                                color="light-blue.6"
                                onClick={() => navigate(`/install/${install?.id}`, {
                                    state: { tab: "shop", }
                                })}>
                                <GrInstall />
                            </ActionIcon>
                        </Tooltip>
                    }>
                        <Text size="xs" c="dimmed">
                            {install?.createdDate ? removeTime(new Date(install?.createdDate), "/") : "No Data"} - {install?.uninstalledTime ? removeTime(new Date(install?.uninstalledTime), "/") : "No Data"}
                        </Text>
                        <Text size="sm">{install.shop.name}</Text>
                    </List.Item>
                ))}
            </List>
        )
    }
}

export const EdgeBoxHistoryList = ({ disabledEdgeBoxList }: { disabledEdgeBoxList: EdgeBoxInstall[] }) => {
    const navigate = useNavigate();

    if (!disabledEdgeBoxList || disabledEdgeBoxList.length == 0) {
        return <Text c="dimmed" w={'100%'} ta={"center"} mt={20} fs="italic">Log empty</Text>
    } else {
        return (
            <List ta={"left"} spacing="sm" size="md" pl={20} pt={10}>
                {disabledEdgeBoxList.map((install, index) => (
                    <List.Item key={index} icon={
                        <Tooltip label="View Installation" withArrow>
                            <ActionIcon variant="filled" size="lg" aria-label="View Installation"
                                color="light-blue.6"
                                onClick={() => navigate(`/install/${install?.id}`, {
                                    state: { tab: "edge box", }
                                })}>
                                <GrInstall />
                            </ActionIcon>
                        </Tooltip>
                    }>
                        <Text size="xs" c="dimmed">
                            {install?.createdDate ? removeTime(new Date(install?.createdDate), "/") : "No Data"} - {install?.uninstalledTime ? removeTime(new Date(install?.uninstalledTime), "/") : "No Data"}
                        </Text>
                        <Text size="sm">{install.edgeBox.name}</Text>
                    </List.Item>
                ))}
            </List>
        )
    }
}