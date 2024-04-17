import { ActionIcon, Box, Button, CopyButton, Divider, Flex, Group, LoadingOverlay, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useState } from "react";
import { AiFillControl, AiFillShop } from "react-icons/ai";
import { MdAccessTime, MdAccountCircle, MdCheck, MdContentCopy, MdHome, MdOutlineAccessTime, MdPhone } from "react-icons/md";
import { TbActivity } from "react-icons/tb";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ActivityList } from "../../../components/list/ActivityList";
import Navbar from "../../../components/navbar/Navbar";
import { useGetInstallById } from "../../../hooks/useEdgeBoxInstalls";
import { useGetEdgeBoxActivitiesByEdgeBoxId, useGetEdgeBoxById, useUpdateEdgeBoxLocation } from "../../../hooks/useEdgeBoxes";
import { formatTime, getDateTime, removeTime } from "../../../utils/dateTimeFunction";
import { addSpace } from "../../../utils/helperFunction";
import styled from "./styles/edgeboxinstalldetail.module.scss";
import { EdgeBoxLocationStatus, StatusColor } from "../../../types/enum";
import { notifications } from "@mantine/notifications";
import axios from "axios";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Install",
        link: "/install"
    },
    {
        title: "Detail"
    }
]

const InstallDetail = () => {

    //TODO: Make UI without any API first, use shop detail as reference
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activeTab, setActiveTab] = useState<string | null>(location?.state?.tab ?? 'shop');

    const { isFetching: isFetchingInstall, data: dataInstall, error: errorInstall, refetch } = useGetInstallById(params.installId!)
    const { isFetching: isFetchingActivity, data: dataActivity, error: errorActivity } = useGetEdgeBoxActivitiesByEdgeBoxId({ edgeBoxId: dataInstall?.edgeBox.id, values: {} })
    const { isFetching: isFetchingEdgeBox, data: dataEdgeBox, error: errorEdgeBox } = useGetEdgeBoxById(dataInstall?.edgeBox.id);
    const { mutate: updateLocation, isLoading: isLoadingLocation } = useUpdateEdgeBoxLocation();

    const onUpdateLocation = (type: EdgeBoxLocationStatus.Installing | EdgeBoxLocationStatus.Uninstalling) => {
        const updateLocationParams = {
            id: params.edgeBoxId!,
            values: {
                location: type == EdgeBoxLocationStatus.Installing ? EdgeBoxLocationStatus.Occupied : EdgeBoxLocationStatus.Idle
            }
        }
        updateLocation(updateLocationParams, {
            onSuccess() {
                refetch()
                notifications.show({
                    title: "Successfully",
                    message: type == EdgeBoxLocationStatus.Installing ? "Edge Box finished installing!" : "Edge Box finished uninstalling!",
                    color: "green",
                    withCloseButton: true,
                });
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
                        message: "Something wrong happen when trying to finish installing this edge box",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    }

    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBack />
            {isFetchingInstall ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["container-detail"]}>
                    {errorInstall ?
                        <Text fs="italic" ta="center">No installation found</Text> :
                        <>
                            <Box>
                                {/* TODO: Install infos here NOT DONE*/}
                                <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"} mb={10}>Install</Text>
                                <Group grow mb={10}>
                                    {dataInstall?.edgeBoxInstallStatus &&
                                        <Box>
                                            <Text size="xs" c={"dimmed"} fw={500}>Install Health</Text>
                                            <StatusBadge statusName={dataInstall?.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Install Health" />
                                        </Box>
                                    }
                                    {dataInstall?.activationStatus &&
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Activation Status</Text>
                                            <StatusBadge statusName={dataInstall?.activationStatus} padding={10} size="sm" tooltip="Activation Status" />
                                        </Box>
                                    }
                                </Group>
                                <Group grow mb={15}>
                                    <Box mb={10}>
                                        <Text size="xs" c={"dimmed"} fw={500}>Ip Address</Text>
                                        <Text size="md" fw={500}>{dataInstall?.ipAddress ?? "No Data"}</Text>
                                    </Box>
                                    <Box mb={10}>
                                        <Text size="xs" c={"dimmed"} fw={500}>Last Connected</Text>
                                        <Text size="md" fw={500}>{dataInstall?.lastSeen ? getDateTime(new Date(dataInstall.lastSeen), true) : "No Data"}</Text>
                                    </Box>
                                    <Box mb={10}>
                                        <Text size="xs" c={"dimmed"} fw={500}>Operating System</Text>
                                        <Text size="md" fw={500}>{dataInstall?.operatingSystem ?? "No Data"}</Text>
                                    </Box>
                                </Group>
                                <Group grow mb={15}>
                                    {dataInstall?.activationCode &&
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Activation Code</Text>
                                            <Group gap={5}>
                                                <Text size="md" fw={500}>{addSpace(dataInstall?.activationCode, 4) || "No Data"}</Text>
                                                <CopyButton value={dataInstall?.activationCode}>
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
                                    }
                                </Group>
                                <Group grow mb={15}>
                                    {dataInstall?.createdDate &&
                                        <Box>
                                            <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                            <Text size="md" fw={500}>{removeTime(new Date(dataInstall?.createdDate || Date.now()), "/")}</Text>
                                        </Box>
                                    }
                                    {dataInstall?.uninstalledTime &&
                                        <Box>
                                            <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Date</Text>
                                            <Text size="md" fw={500}>{removeTime(new Date(dataInstall?.uninstalledTime), "/")}</Text>
                                        </Box>
                                    }
                                </Group>
                            </Box>
                            <Divider my="md" />
                            <Box>
                                <Tabs value={activeTab} onChange={setActiveTab}>
                                    <Tabs.List>
                                        <Tabs.Tab value="shop" leftSection={<AiFillShop />}>
                                            Shop
                                        </Tabs.Tab>
                                        <Tabs.Tab value="edge box" leftSection={<AiFillControl />}>
                                            Edge Box
                                        </Tabs.Tab>
                                        <Tabs.Tab value="activities" leftSection={<TbActivity />} ml="auto">
                                            Activities
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    {/* Shop Tab */}
                                    <Tabs.Panel value="shop">
                                        {dataInstall?.shop ?
                                            <Group m={20} grow justify="space-between">
                                                <div>
                                                    <Group mb={15} justify="space-between">
                                                        <Group>
                                                            <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{dataInstall?.shop?.name}</Text>
                                                            <StatusBadge statusName={dataInstall?.shop?.shopStatus ?? "None"} />
                                                        </Group>
                                                        <Button variant="filled" size="sm" color="light-blue.6"
                                                            onClick={() => navigate(`/shop/${dataInstall?.shop?.id}`, {
                                                                state: { tab: "edge boxes", }
                                                            })}>
                                                            View Shop
                                                        </Button>
                                                    </Group>
                                                    <Group>
                                                        <MdAccountCircle style={{ width: 18, height: 18 }} />
                                                        Shop Manager:
                                                        {dataInstall?.shop?.shopManager ?
                                                            <Link to={`/account/${dataInstall?.shop?.shopManager?.id}`} style={{ textDecoration: 'none' }}>
                                                                <Text size="md">{dataInstall?.shop?.shopManager?.name}</Text>
                                                            </Link>
                                                            :
                                                            <Text size="md">None</Text>
                                                        }
                                                    </Group>
                                                    <Group>
                                                        <MdOutlineAccessTime />
                                                        <Text size="md">
                                                            <b>Open:</b> {dataInstall?.shop?.openTime ? formatTime(dataInstall?.shop?.openTime, false, false) : "No Data"} - <b>Close:</b> {dataInstall?.shop?.closeTime ? formatTime(dataInstall?.shop?.closeTime, false, false) : "No Data"}
                                                        </Text>
                                                    </Group>

                                                    {dataInstall?.shop?.phone &&
                                                        <Group>
                                                            <MdPhone style={{ width: 18, height: 18 }} />
                                                            <Text size="md">{dataInstall?.shop?.phone}</Text>
                                                        </Group>
                                                    }
                                                    {(dataInstall?.shop?.ward || dataInstall?.shop?.addressLine) &&
                                                        <Group>
                                                            <MdHome style={{ width: 18, height: 18 }} />
                                                            {(dataInstall?.shop?.ward && dataInstall?.shop?.addressLine) && <Text size="md">{dataInstall?.shop.addressLine}, {dataInstall?.shop.ward?.name}, {dataInstall?.shop.ward?.district?.name}, {dataInstall?.shop.ward?.district?.province?.name}</Text>}
                                                            {(dataInstall?.shop?.ward && !dataInstall?.shop?.addressLine) && <Text size="md">{dataInstall?.shop.ward?.name}, {dataInstall?.shop.ward?.district?.name}, {dataInstall?.shop.ward?.district?.province?.name}</Text>}
                                                            {(!dataInstall?.shop?.ward && dataInstall?.shop?.addressLine) && <Text size="md">{dataInstall?.shop.addressLine}</Text>}
                                                        </Group>
                                                    }
                                                    {dataInstall?.shop?.createdDate &&
                                                        <Group mb={20}>
                                                            <MdAccessTime style={{ width: 18, height: 18 }} />
                                                            <Text size="md">Created on: {dataInstall?.shop?.createdDate && removeTime(new Date(dataInstall?.shop?.createdDate), "/")}</Text>
                                                        </Group>
                                                    }
                                                </div>
                                            </Group>
                                            :
                                            <Text fs="italic" ta="center">No Shop found</Text>
                                        }
                                    </Tabs.Panel>

                                    {/* Edge Box Tab */}
                                    <Tabs.Panel value="edge box">
                                        {isFetchingEdgeBox ?
                                            <Box className={styled["loader"]}>
                                                <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                            </Box> : errorEdgeBox ?
                                                <Text fs="italic" ta="center">Error getting data from the server</Text> :
                                                <Flex justify={"space-between"} mt={20} ml={10}>
                                                    <Flex justify={"space-between"} mr={10}>
                                                        <div>
                                                            <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"} mb={10}>{dataEdgeBox?.name}</Text>
                                                            <Flex wrap="wrap" justify="space-between" gap="md">
                                                                {dataEdgeBox?.edgeBoxStatus &&
                                                                    <Box mb={10} ml={5}>
                                                                        <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                                                                        <StatusBadge statusName={dataEdgeBox?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                                                                    </Box>
                                                                }
                                                                {dataEdgeBox?.edgeBoxLocation &&
                                                                    <Box mb={10} ml={5}>
                                                                        <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                                                                        <StatusBadge statusName={dataEdgeBox?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                                                                    </Box>
                                                                }
                                                                {dataEdgeBox?.version &&
                                                                    <Box mb={10} ml={5}>
                                                                        <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                                                                        <Text size="md" fw={500}>{"Status"}</Text>
                                                                    </Box>
                                                                }
                                                                {dataEdgeBox?.createdDate &&
                                                                    <Box mb={10} ml={5}>
                                                                        <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                                                        <Text size="md" fw={500}>{removeTime(new Date(Date.now()), "/")}</Text>
                                                                    </Box>
                                                                }
                                                            </Flex>
                                                        </div>
                                                    </Flex>
                                                    <Divider orientation="vertical" ml={10} mr={10} />

                                                    {/* Edge Box Model section */}
                                                    <Box w={'100%'} ml={10}>
                                                        <Group justify="space-between">
                                                            <Text size='md' fw="bold" fz={20} c={"light-blue.4"}>Model</Text>
                                                            <Group>
                                                                {dataEdgeBox?.edgeBoxLocation == EdgeBoxLocationStatus.Installing &&
                                                                    <Button
                                                                        onClick={() => onUpdateLocation(EdgeBoxLocationStatus.Installing)} variant="filled"
                                                                        color={StatusColor.ACTIVE} size="sm" loading={isLoadingLocation}
                                                                    >
                                                                        Finish Installing
                                                                    </Button>
                                                                }
                                                                {dataEdgeBox?.edgeBoxLocation == EdgeBoxLocationStatus.Uninstalling &&
                                                                    <Button
                                                                        onClick={() => onUpdateLocation(EdgeBoxLocationStatus.Uninstalling)} variant="filled"
                                                                        color={StatusColor.ACTIVE} size="sm" loading={isLoadingLocation}
                                                                    >
                                                                        Finish Uninstalling
                                                                    </Button>
                                                                }
                                                                <Button variant="filled" size="sm" color="light-blue.6"
                                                                    onClick={() => navigate(`/edgebox/${dataEdgeBox?.id}`, {
                                                                        state: { tab: "edge boxes", }
                                                                    })}>
                                                                    View Edge Box
                                                                </Button>
                                                            </Group>
                                                        </Group>
                                                        <Group grow mb={10} mt={10}>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Name</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.name || "Name"}</Text>
                                                            </Box>
                                                        </Group>

                                                        {dataEdgeBox?.edgeBoxModel?.description &&
                                                            <>
                                                                <Divider mb={10} />
                                                                <Box>
                                                                    <Text size="xs" c={"dimmed"} fw={500}>Description</Text>
                                                                    <Text size="sm" mb={10}>{dataEdgeBox?.edgeBoxModel?.description}</Text>
                                                                </Box>
                                                            </>
                                                        }
                                                        <Divider mb={10} />
                                                        <Group grow mb={15}>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Model code</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.modelCode || "No Data"}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Manufacturer</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.manufacturer || "No Data"}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Storage</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.storage || "No Data"}</Text>
                                                            </Box>
                                                        </Group>
                                                        <Group grow>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>CPU</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.cpu || "No Data"}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>RAM</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.ram || "No Data"}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text size="xs" c={"dimmed"} fw={500}>OS</Text>
                                                                <Text size="md" fw={500}>{dataEdgeBox?.edgeBoxModel?.os || "No Data"}</Text>
                                                            </Box>
                                                        </Group>
                                                    </Box>
                                                </Flex>
                                        }
                                    </Tabs.Panel>

                                    {/* Activity Tab */}
                                    <Tabs.Panel value="activities">
                                        {isFetchingActivity ?
                                            <Box className={styled["loader"]}>
                                                <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                            </Box> : errorActivity ?
                                                <Text fs="italic" ta="center">Error getting data from the server</Text> :
                                                <ActivityList activityList={dataActivity} />
                                        }
                                    </Tabs.Panel>
                                </Tabs>
                            </Box>
                        </>
                    }
                </div>
            }
        </div >
    );
};

export default InstallDetail;
