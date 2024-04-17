import { ActionIcon, Box, Button, Card, CopyButton, Divider, Group, Modal, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { MdCheck, MdContentCopy, MdHistory, MdPlayArrow, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUninstallEdgeBox } from "../../hooks/useEdgeBoxInstalls";
import { CommonResponse } from "../../models/CommonResponse";
import { EdgeBoxInstall } from "../../models/EdgeBoxInstall";
import { EdgeBoxInstallStatus, EdgeBoxLocationStatus } from "../../types/enum";
import { removeTime } from "../../utils/dateTimeFunction";
import { addSpace } from "../../utils/helperFunction";
import StatusBadge from "../badge/StatusBadge";
import { EdgeBoxHistoryList } from "./HistoryList";
import styled from "./list.module.scss";

interface EdgeBoxInstallListParam {
    refetch: () => void;
    refetchInstall: () => void;
    dataInstalls: CommonResponse<EdgeBoxInstall>;
}

interface InstallCardParams {
    item: EdgeBoxInstall | undefined;
    refetch: () => void;
    refetchInstall: () => void;
}

const InstallCard = ({ item, refetch, refetchInstall }: InstallCardParams) => {
    const navigate = useNavigate();
    const [modalUninstallOpen, { open: openUninstall, close: closeUninstall }] = useDisclosure(false);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const { mutate: uninstall, isLoading } = useUninstallEdgeBox();

    const onUninstall = () => {
        uninstall(item?.id || "", {
            onSuccess() {
                notifications.show({
                    title: "Successfully",
                    message: "Edge Box is uninstalling...",
                    color: "light-yellow.5",
                    withCloseButton: true,
                });
                refetch();
                refetchInstall();
                closeUninstall();
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        title: "Failed",
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    console.error(error);
                    notifications.show({
                        title: "Failed",
                        message: "Something wrong happen when trying to uninstall",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                close();
            },
        });
    }
    if (!item) return <Text c="dimmed" w={'100%'} ta={"center"} mt={20} fs="italic">No Edge box currently connected</Text>

    return (
        <>
            <Card pt={10} pl={20} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                bg={computedColorScheme == "light" ? "white" : "#1f1f1f"}>
                <Group justify="space-between">
                    <Text size='md' fw={'bold'} fz={25}
                        c={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>
                        {item?.edgeBox?.name}
                    </Text>
                    <Group>
                        {item?.edgeBox?.edgeBoxLocation == EdgeBoxLocationStatus.Occupied &&
                            <Button
                                onClick={openUninstall} variant="filled"
                                color="pale-red.4" size="sm"
                            >
                                Uninstall
                            </Button>
                        }
                        <Button variant="filled" size="sm"
                            color={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.7"}
                            onClick={() => navigate(`/edgebox/${item.edgeBox.id}`)}>
                            View Edge Box
                        </Button>
                    </Group>
                </Group>

                {/* Edgebox section*/}
                <Group mb={10} mt={10}>
                    <Text fw={500} size="sm" c={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>Edge Box</Text>
                    {item?.edgeBox?.edgeBoxStatus &&
                        <StatusBadge statusName={item?.edgeBox?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                    }
                </Group>
                <Group grow mb={20}>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                        <StatusBadge statusName={item?.edgeBox?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                    </Box>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Serial Number</Text>
                        <Text size="md" fw={500}>{item?.edgeBox?.serialNumber || "No Data"}</Text>
                    </Box>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                        <Text size="md" fw={500}>{item?.edgeBox?.version || "No Data"}</Text>
                    </Box>
                </Group>
                <Group grow mb={15}>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Model</Text>
                        <Text size="md" fw={500}>{item?.edgeBox?.edgeBoxModel?.name || "No Data"}</Text>
                    </Box>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Created On</Text>
                        <Text size="md" fw={500}>{removeTime(new Date(item?.edgeBox?.createdDate || Date.now()), "/")}</Text>
                    </Box>
                </Group>

                {/* Install section*/}
                <Divider mb={10} />
                <Group mb={10}>
                    <Text fw={500} size="md" c={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>Install</Text>
                    <Tooltip label="View Installation" withArrow>
                        <ActionIcon variant="light" onClick={() => navigate(`/install/${item.id}`, { state: { tab: "shop" } })}>
                            <MdRemoveRedEye />
                        </ActionIcon>
                    </Tooltip>
                </Group>

                <Group grow mb={10}>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Install Health</Text>
                        <StatusBadge statusName={item?.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Install Health" />
                    </Box>
                    <Box mb={10}>
                        <Text size="xs" c={"dimmed"} fw={500}>Activation Status</Text>
                        <StatusBadge statusName={item.activationStatus} padding={10} size="sm" tooltip="Activation Status" />
                    </Box>
                </Group>
                <Group grow mb={15}>
                    <Box mb={10}>
                        <Text size="xs" c={"dimmed"} fw={500}>Activation Code</Text>
                        <Group gap={5}>
                            <Text size="md" fw={500}>{addSpace(item?.activationCode, 4) || "No Data"}</Text>
                            <CopyButton value={item?.activationCode}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? 'Copied' : 'Copy code'} withArrow>
                                        <ActionIcon color={computedColorScheme == "dark" ? 'light-blue.3' : 'light-blue.6'} onClick={copy} variant="transparent">
                                            {copied ? <MdCheck /> :
                                                <MdContentCopy />
                                            }
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </Group>
                    </Box>
                    {item.uninstalledTime &&
                        <Box mb={10}>
                            <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Date</Text>
                            <Text size="md" fw={500}>{removeTime(new Date(item.uninstalledTime), "/")}</Text>
                        </Box>
                    }
                </Group>
                <Group>
                    <Box>
                        <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                        <Text size="md" fw={500}>{removeTime(new Date(item.createdDate || Date.now()), "/")}</Text>
                    </Box>
                </Group>
            </Card>

            {/* Modal section */}
            {/* Uninstall */}
            <Modal opened={modalUninstallOpen} onClose={closeUninstall} withCloseButton={false} centered>
                <Text>
                    Do you want to uninstall this edge box from the shop?
                </Text>
                <Group align="end">
                    <Button
                        variant="gradient" size="md" mt={20}
                        onClick={onUninstall} loading={isLoading}
                        gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                    >
                        Uninstall
                    </Button>
                    <Button
                        variant="outline" size="md" mt={20} onClick={closeUninstall}
                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                    >
                        Cancel
                    </Button>
                </Group>
            </Modal>
        </>
    )
}
export const EdgeBoxInstallListByShopId = ({ refetch, dataInstalls, refetchInstall }: EdgeBoxInstallListParam) => {

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    // console.log(installData)
    return (
        <div className={styled["card-detail"]}>
            <Tabs defaultValue="current" orientation="vertical" mt={20}
                color={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>
                <Tabs.List>
                    <Tabs.Tab value="current" leftSection={<MdPlayArrow />}>
                        Current
                    </Tabs.Tab>
                    <Tabs.Tab value="history" leftSection={<MdHistory />}>
                        History
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="current">
                    <Box ml={20}>
                        {(dataInstalls?.values && dataInstalls?.values?.filter(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).length > 0) ?
                            <>
                                {dataInstalls?.values?.filter(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).map((installFilter, index) => (
                                    <InstallCard item={installFilter} refetch={refetch} refetchInstall={refetchInstall} key={index} />
                                ))}
                            </>
                            :
                            <Text fs="italic" ta="center" c="dimmed" mt={20}>No edge box currently connected to this shop</Text>
                        }
                    </Box>
                </Tabs.Panel>
                <Tabs.Panel value="history">
                    <EdgeBoxHistoryList disabledEdgeBoxList={dataInstalls?.values.filter(e => e.edgeBoxInstallStatus == EdgeBoxInstallStatus.Disabled) ?? []} />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}