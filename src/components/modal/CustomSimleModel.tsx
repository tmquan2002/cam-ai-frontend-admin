import { Button, Group, Modal, Text } from "@mantine/core";

interface RedModalParams {
    color?: "red" | "green" | "blue"
    topTitle?: string;
    label?: string;
    cancelLabel: string;
    opened: boolean;
    onClose: () => void;
    withCloseButton?: boolean;
    centered?: boolean;
    title: string;
    onClickAction: () => void;
    loading?: boolean;
}
export const CustomModal = ({ opened, onClose, withCloseButton, onClickAction, title, centered, loading, cancelLabel, label, topTitle, color }: RedModalParams) => {
    return (
        <Modal opened={opened} onClose={onClose} withCloseButton={withCloseButton} centered={centered} title={topTitle}>
            <Text>
                {title}
            </Text>
            <Group align="end">
                <Button
                    variant="gradient" size="md" mt={20}
                    onClick={onClickAction} loading={loading}
                    gradient={color == "blue" ? { from: "light-blue.5", to: "light-blue.7", deg: 90 } :
                        color == "green" ? { from: "green.5", to: "green.7", deg: 90 } : { from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                >
                    {label}
                </Button>
                <Button
                    variant="outline" size="md" mt={20} onClick={onClose}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    {cancelLabel}
                </Button>
            </Group>
        </Modal>
    )
}