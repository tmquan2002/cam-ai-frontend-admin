import { Badge, List } from "@mantine/core"

// Show edgebox history later
export const HistoryList = () => {
    return (
        <List
            ta={"left"}
            spacing="xs"
            size="sm"
            icon={
                <Badge size='lg' radius={"lg"} p={15} autoContrast color="blue">
                    10:49
                </Badge>
            }
        >
            <List.Item>Clone or download repository from GitHub</List.Item>
            <List.Item>Install dependencies with yarn</List.Item>
            <List.Item>To start development server run npm start command</List.Item>
            <List.Item>Run tests to make sure your changes do not break the build</List.Item>
            <List.Item
                icon={
                    <Badge size='lg' radius={"lg"} p={15} autoContrast color="blue">
                        10:49
                    </Badge>
                }
            >
                Submit a pull request once you are done
            </List.Item>
        </List>
    )
}