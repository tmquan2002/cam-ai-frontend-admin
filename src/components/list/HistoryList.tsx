import { ActionIcon, List, Text, Tooltip } from "@mantine/core";
import { AiFillShop } from "react-icons/ai";
import { GrInstall } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { EdgeBoxInstall } from "../../models/EdgeBox";
import { removeTime } from "../../utils/dateFunction";

// Show edgebox history later
export const ShopHistoryList = () => {

    return (
        <List ta={"left"} spacing="sm" size="md"
            icon={
                <Tooltip label="View this shop" withArrow>
                    <ActionIcon variant="filled" size="lg" aria-label="View Shop"
                        color="light-blue.6"
                        onClick={() => { }}>
                        <AiFillShop />
                    </ActionIcon>
                </Tooltip>
            }
        >
            <List.Item>
                <Text size="xs" c="dimmed">24/04/2024</Text>
                <Text size="sm">Clone or download repository from GitHub</Text>
            </List.Item>
            <List.Item>
                <Text size="xs" c="dimmed">24/04/2024</Text>
                <Text size="sm">Install dependencies with yarn</Text>
            </List.Item>
            <List.Item>
                <Text size="xs" c="dimmed">24/04/2024</Text>
                <Text size="sm">To start development server run npm start command</Text>
            </List.Item>
            <List.Item>
                <Text size="xs" c="dimmed">24/04/2024</Text>
                <Text size="sm">Run tests to make sure your changes do not break the build</Text>
            </List.Item>
            <List.Item>
                <Text size="xs" c="dimmed">24/04/2024</Text>
                <Text size="sm">Submit a pull request once you are done</Text>
            </List.Item>
        </List>
    )
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
                                onClick={() => navigate(`/install/${install?.edgeBox?.id}`)}>
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