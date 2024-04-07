import { ActionIcon, Box, Button, Card, CopyButton, Divider, Group, Modal, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { MdCheck, MdContentCopy, MdHistory, MdHome, MdOutlineAccessTime, MdPageview, MdPhone, MdPlayArrow } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { EdgeBoxInstall } from "../../models/EdgeBox";
import { EdgeBoxInstallStatus, EdgeBoxLocationStatus } from "../../types/enum";
import { removeTime } from "../../utils/dateFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";
import { ShopHistoryList } from "./HistoryList";
import { addSpace } from "../../utils/helperFunction";
import { CommonResponse } from "../../models/CommonResponse";

const ShopCard = ({ item, edgeBoxLocation }: { item: EdgeBoxInstall | undefined, edgeBoxLocation: EdgeBoxLocationStatus }) => {
    // console.log(item)
    const navigate = useNavigate();
    const [modalUninstallOpen, { open: openUninstall, close: closeUninstall }] = useDisclosure(false);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    if (!item) return <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Shop currently connected to this Edge Box</Text>

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
                            {/* TODO: Add uninstall API here */}
                            <Group>
                                {edgeBoxLocation == EdgeBoxLocationStatus.Occupied &&
                                    <Button
                                        onClick={openUninstall} variant="filled"
                                        color="pale-red.4" size="sm"
                                    >
                                        Uninstall
                                    </Button>
                                }
                                <ActionIcon.Group>
                                    <Tooltip label="View Shop" withArrow>
                                        <ActionIcon variant="outline" size="lg" aria-label="View Shop" color="light-blue.6"
                                            onClick={() => navigate(`/shop/${item?.shop?.id}`)}>
                                            <MdPageview />
                                        </ActionIcon>
                                    </Tooltip>
                                </ActionIcon.Group>
                            </Group>
                        </Group>
                        :
                        <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Shop currently connected to this Edge Box</Text>
                    }

                    <div className={styled["icon-text"]}>
                        <MdOutlineAccessTime style={{ width: '20px', height: '20px' }} />
                        <span className={styled["information"]}><b>Open:</b> {item?.shop.openTime || "No Data"} - <b>Close:</b> {item?.shop.closeTime || "No Data"}</span>
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
                            <Text size="xs" c={"dimmed"} fw={500}>Install Status</Text>
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
                            variant="outline" size="md" mt={20} onClick={closeUninstall}
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            CANCEL
                        </Button>
                        <Button
                            variant="gradient" size="md" mt={20}
                            onClick={() => {
                                notifications.show({
                                    message: "This feature is in development",
                                    color: "light-yellow.5",
                                    withCloseButton: true,
                                })
                                closeUninstall();
                            }}
                            gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                        >
                            UNINSTALL
                        </Button>
                    </Group>
                </Modal>
            </>
        )
}

export const ShopLongListByEdgeBox = ({ edgeBoxLocation, dataInstalls }: { edgeBoxLocation: EdgeBoxLocationStatus, dataInstalls: CommonResponse<EdgeBoxInstall> }) => {

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
                                edgeBoxLocation={edgeBoxLocation} />
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