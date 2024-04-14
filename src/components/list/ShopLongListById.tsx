import { ActionIcon, Box, Button, Card, CopyButton, Divider, Group, Modal, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { MdCheck, MdContentCopy, MdHistory, MdHome, MdOutlineAccessTime, MdPageview, MdPhone, MdPlayArrow } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUninstallEdgeBox } from "../../hooks/useEdgeBoxInstalls";
import { CommonResponse } from "../../models/CommonResponse";
import { EdgeBoxInstall } from "../../models/EdgeBoxInstall";
import { EdgeBoxInstallStatus, EdgeBoxLocationStatus } from "../../types/enum";
import { formatTime, removeTime } from "../../utils/dateTimeFunction";
import { addSpace } from "../../utils/helperFunction";
import StatusBadge from "../badge/StatusBadge";
import { ShopHistoryList } from "./HistoryList";
import styled from "./list.module.scss";

interface ShopCardParams {
    item: EdgeBoxInstall | undefined;
    edgeBoxLocation: EdgeBoxLocationStatus;
    refetch: () => void;
    refetchInstall: () => void;
}

interface ShopLongListByEdgeBoxParams {
    edgeBoxLocation: EdgeBoxLocationStatus;
    dataInstalls: CommonResponse<EdgeBoxInstall>;
    refetch: () => void;
    refetchInstall: () => void;
}

const ShopCard = ({ item, edgeBoxLocation, refetch, refetchInstall }: ShopCardParams) => {
    // console.log(item)
    const navigate = useNavigate();
    const [modalUninstallOpen, { open: openUninstall, close: closeUninstall }] = useDisclosure(false);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const { mutate: uninstall, isLoading } = useUninstallEdgeBox();

    const onUninstall = () => {
        // console.log("aa")
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


    if (!item) return <Text c="dimmed" w={'100%'} ta={"center"} mt={20} fs="italic">No Shop currently connected to this Edge Box</Text>

    if (item)
        return (
            <>
                <Card padding="lg" radius="md" m={10}
                    style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                    {item?.shop ?
                        <Group mb={10} justify="space-between">
                            <Group>
                                <Text fw={500} size="lg">{item?.shop?.name}</Text>
                                {item?.shop?.shopStatus &&
                                    <StatusBadge statusName={item?.shop?.shopStatus} padding={10} size="sm" tooltip="Shop Status" />
                                }
                            </Group>
                            <Group>
                                {edgeBoxLocation == EdgeBoxLocationStatus.Occupied &&
                                    <Button
                                        onClick={openUninstall} variant="filled"
                                        color="pale-red.4" size="sm"
                                    >
                                        UNINSTALL
                                    </Button>
                                }
                                <ActionIcon.Group>
                                    <Tooltip label="View Shop" withArrow>
                                        <ActionIcon variant="outline" size="lg" aria-label="View Shop" color="light-blue.6"
                                            onClick={() => navigate(`/shop/${item?.shop?.id}`, {
                                                state: { tab: "edge boxes", }
                                            })}>
                                            <MdPageview />
                                        </ActionIcon>
                                    </Tooltip>
                                </ActionIcon.Group>
                            </Group>
                        </Group>
                        :
                        <Text c="dimmed" w={'100%'} ta={"center"} mt={20} fs="italic">No Shop currently connected to this Edge Box</Text>
                    }

                    <div className={styled["icon-text"]}>
                        <MdOutlineAccessTime style={{ width: '20px', height: '20px' }} />
                        <span className={styled["information"]}>
                            <b>Open:</b> {item?.shop?.openTime ? formatTime(item?.shop?.openTime, false, false) : "No Data"} - <b>Close:</b> {item?.shop?.closeTime ? formatTime(item?.shop?.closeTime, false, false) : "No Data"}
                        </span>
                    </div>

                    {(item?.shop.addressLine || item?.shop.ward) &&
                        <div className={styled["icon-text"]}>
                            <MdHome style={{ width: '20px', height: '20px' }} />
                            {item.shop.addressLine && item.shop.ward ?
                                <span className={styled["information"]}>{item.shop.addressLine}, {item.shop.ward?.name}, {item.shop.ward?.district?.name}, {item.shop.ward?.district?.province?.name}</span>
                                : item.shop.addressLine ? <span className={styled["information"]}>{item.shop.addressLine}</span>
                                    : item.shop.ward ? <span className={styled["information"]}>{item.shop.ward?.name}, {item.shop.ward?.district?.name}, {item.shop.ward?.district?.province?.name}</span>
                                        : "None"
                            }
                        </div>
                    }

                    {item.shop.phone &&
                        <div className={styled["icon-text"]}>
                            <MdPhone style={{ width: '20px', height: '20px' }} />
                            <span className={styled["information"]}>{item.shop.phone}</span>
                        </div>
                    }

                    <Divider mb={10} mt={10} />

                    {/* Install Section */}
                    <Group grow mb={10} ml={10}>
                        <Box mb={10}>
                            <Text size="xs" c={"dimmed"} fw={500}>Install Health</Text>
                            <StatusBadge statusName={item.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Location Status" />
                        </Box>
                        <Box mb={10}>
                            <Text size="xs" c={"dimmed"} fw={500}>Activation Status</Text>
                            <StatusBadge statusName={item.activationStatus} padding={10} size="sm" tooltip="Activation Status" />
                        </Box>
                    </Group>
                    <Group grow mb={10} ml={10}>
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
                                <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Time</Text>
                                <Text size="md" fw={500}>{removeTime(new Date(item.uninstalledTime), "/")}</Text>
                            </Box>
                        }
                    </Group>
                    <Group grow mb={15} ml={10}>
                        <Box>
                            <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                            <Text size="md" fw={500}>{removeTime(new Date(item?.createdDate || Date.now()), "/")}</Text>
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
                            UNINSTALL
                        </Button>
                        <Button
                            variant="outline" size="md" mt={20} onClick={closeUninstall}
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            CANCEL
                        </Button>
                    </Group>
                </Modal>
            </>
        )
}

export const ShopLongListByEdgeBox = ({ edgeBoxLocation, dataInstalls, refetch, refetchInstall }: ShopLongListByEdgeBoxParams) => {

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

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
                        {dataInstalls?.values &&
                            <ShopCard item={dataInstalls?.values.find(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled)}
                                edgeBoxLocation={edgeBoxLocation} refetch={refetch} refetchInstall={refetchInstall} />
                        }
                    </Box>
                </Tabs.Panel>
                <Tabs.Panel value="history">
                    <ShopHistoryList disabledEdgeBoxList={dataInstalls?.values.filter(e => e.edgeBoxInstallStatus == EdgeBoxInstallStatus.Disabled) ?? []} />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}