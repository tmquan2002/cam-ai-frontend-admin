import { ActionIcon, Box, CopyButton, Divider, Flex, Group, LoadingOverlay, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { AiFillControl, AiFillShop } from "react-icons/ai";
import { MdAccessTime, MdAccountCircle, MdCheck, MdContentCopy, MdHome, MdOutlineAccessTime, MdPageview, MdPhone } from "react-icons/md";
import { TbActivity } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ActivityList } from "../../../components/list/ActivityList";
import Navbar from "../../../components/navbar/Navbar";
import { useGetInstallById } from "../../../hooks/useEdgeBoxInstalls";
import { useGetEdgeBoxActivitiesByEdgeBoxId } from "../../../hooks/useEdgeBoxes";
import { formatTime, removeTime } from "../../../utils/dateTimeFunction";
import { addSpace } from "../../../utils/helperFunction";
import styled from "./styles/edgeboxinstalldetail.module.scss";

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
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const { isFetching: isFetchingInstall, data: dataInstall, error: errorInstall } = useGetInstallById(params.installId!)
    const { isFetching: isFetchingActivity, data: dataActivity, error: errorActivity } = useGetEdgeBoxActivitiesByEdgeBoxId({ edgeBoxId: "379eb0d1-b555-4f76-81a7-6d28c5991c85", values: {} })

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
                                            <StatusBadge statusName={dataInstall?.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Activation Status" />
                                        </Box>
                                    }
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
                                    {dataInstall?.uninstalledTime &&
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Time</Text>
                                            <Text size="md" fw={500}>{removeTime(new Date(dataInstall?.uninstalledTime), "/")}</Text>
                                        </Box>
                                    }
                                </Group>
                                <Group>
                                    {dataInstall?.createdDate &&
                                        <Box>
                                            <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                            <Text size="md" fw={500}>{removeTime(new Date(dataInstall?.createdDate || Date.now()), "/")}</Text>
                                        </Box>
                                    }
                                </Group>
                            </Box>
                            <Divider my="md" />
                            <Box>
                                <Tabs defaultValue="shop">
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
                                            <Group m={20} justify="space-between">
                                                <Group>
                                                    <Group mb={15}>
                                                        <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{dataInstall?.shop?.name}</Text>
                                                        <StatusBadge statusName={dataInstall?.shop?.shopStatus ?? "None"} />
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
                                                    <Group>
                                                        <MdHome style={{ width: 18, height: 18 }} />
                                                        <Text size="md">"Address</Text>
                                                    </Group>
                                                    {dataInstall?.shop?.createdDate &&
                                                        <Group mb={20}>
                                                            <MdAccessTime style={{ width: 18, height: 18 }} />
                                                            <Text size="md">Created on: {dataInstall?.shop?.createdDate && removeTime(new Date(dataInstall?.shop?.createdDate), "/")}</Text>
                                                        </Group>
                                                    }
                                                </Group>
                                                <ActionIcon.Group>
                                                    <Tooltip label="View Shop" withArrow>
                                                        <ActionIcon variant="outline" size="lg" aria-label="View Shop" color="light-blue.6"
                                                            onClick={() => navigate(`/shop/${dataInstall?.shop?.id}`, {
                                                                state: { tab: "edge boxes", }
                                                            })}>
                                                            <MdPageview />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </ActionIcon.Group>
                                            </Group>
                                            :
                                            <Text fs="italic" ta="center">No Shop found</Text>
                                        }
                                    </Tabs.Panel>

                                    {/* Edge Box Tab */}
                                    <Tabs.Panel value="edge box">
                                        <Flex justify={"space-between"} mt={20} ml={10}>
                                            <Flex justify={"space-between"} mr={10}>
                                                <div>
                                                    <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"} mb={10}>Name</Text>
                                                    <Flex wrap="wrap" justify="space-between" gap="md">
                                                        {dataInstall?.edgeBox?.edgeBoxStatus &&
                                                            <Box mb={10} ml={5}>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                                                                <StatusBadge statusName={"Status"} padding={10} size="sm" tooltip="Edge Box Status" />
                                                            </Box>
                                                        }
                                                        {dataInstall?.edgeBox?.edgeBoxLocation &&
                                                            <Box mb={10} ml={5}>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                                                                <StatusBadge statusName={"Status"} padding={10} size="sm" tooltip="Location Status" />
                                                            </Box>
                                                        }
                                                        {dataInstall?.edgeBox?.version &&
                                                            <Box mb={10} ml={5}>
                                                                <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                                                                <Text size="md" fw={500}>{"Status"}</Text>
                                                            </Box>
                                                        }
                                                        {dataInstall?.edgeBox?.createdDate &&
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
                                                <Text size='md' fw="bold" fz={20} c={"light-blue.4"}>Model</Text>
                                                <Group grow mb={10} mt={10}>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Name</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.name || "Name"}</Text>
                                                    </Box>
                                                </Group>

                                                {dataInstall?.edgeBox?.edgeBoxModel?.description &&
                                                    <>
                                                        <Divider mb={10} />
                                                        <Box>
                                                            <Text size="xs" c={"dimmed"} fw={500}>Description</Text>
                                                            <Text size="sm" mb={10}>{dataInstall?.edgeBox?.edgeBoxModel?.description}</Text>
                                                        </Box>
                                                    </>
                                                }
                                                <Divider mb={10} />
                                                <Group grow mb={15}>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Model code</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.modelCode || "No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Manufacturer</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.manufacturer || "No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Storage</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.storage || "No Data"}</Text>
                                                    </Box>
                                                </Group>
                                                <Group grow>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>CPU</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.cpu || "No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>RAM</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.ram || "No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>OS</Text>
                                                        <Text size="md" fw={500}>{dataInstall?.edgeBox?.edgeBoxModel?.os || "No Data"}</Text>
                                                    </Box>
                                                </Group>
                                            </Box>
                                        </Flex>
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
