import { ActionIcon, List, Text, Tooltip } from "@mantine/core";
import { AiFillControl, AiFillShop } from "react-icons/ai";
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

    if (disabledEdgeBoxList.length == 0) {
        return <Text c="dimmed" w={'100%'} ta={"center"}>Log empty</Text>
    } else {
        return (
            <List ta={"left"} spacing="sm" size="md">
                {disabledEdgeBoxList.map((install) => (
                    <List.Item icon={
                        <Tooltip label="View this edge box" withArrow>
                            <ActionIcon variant="filled" size="lg" aria-label="View Edge Box"
                                color="light-blue.6"
                                onClick={() => { }}>
                                <AiFillControl />
                            </ActionIcon>
                        </Tooltip>
                    }>
                        <Text size="xs" c="dimmed">{removeTime(new Date(install.edgeBox.createdDate), "/")}</Text>
                        <Text size="sm">{install.edgeBox.name}</Text>
                    </List.Item>
                ))}
            </List>
        )
    }
}