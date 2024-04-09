import { ActionIcon, Box, Button, CopyButton, Divider, Flex, Group, LoadingOverlay, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { AiFillControl, AiFillShop } from "react-icons/ai";
import { MdAccessTime, MdAccountCircle, MdCheck, MdContentCopy, MdHome, MdOutlineAccessTime, MdPhone } from "react-icons/md";
import { TbActivity } from "react-icons/tb";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ActivityList } from "../../../components/list/ActivityList";
import Navbar from "../../../components/navbar/Navbar";
import { useGetEdgeBoxActivitiesByEdgeBoxId } from "../../../hooks/useEdgeBoxes";
import { removeTime } from "../../../utils/dateFunction";
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
    // const params = useParams();
    // const navigate = useNavigate();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const { isFetching, data, error } = useGetEdgeBoxActivitiesByEdgeBoxId({ edgeBoxId: "379eb0d1-b555-4f76-81a7-6d28c5991c85", values: {} })
    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBack />
            {isFetching ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["container-detail"]}>
                    {error ?
                        <Text fs="italic" ta="center">No installation found</Text> :
                        <>
                            <Box>
                                {/* TODO: Install infos here NOT DONE*/}
                                <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"} mb={10}>Install</Text>
                                <Group grow mb={10}>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>Install Status</Text>
                                        <StatusBadge statusName={"Status"} padding={10} size="sm" tooltip="Install Status" />
                                    </Box>
                                    <Box mb={10}>
                                        <Text size="xs" c={"dimmed"} fw={500}>Activation Status</Text>
                                        <StatusBadge statusName={"Status"} padding={10} size="sm" tooltip="Activation Status" />
                                    </Box>
                                </Group>
                                <Group grow mb={15}>
                                    <Box mb={10}>
                                        <Text size="xs" c={"dimmed"} fw={500}>Activation Code</Text>
                                        <Group gap={5}>
                                            <Text size="md" fw={500}>{addSpace("LKDGNDDZ8IBYP9HA", 4) || "No Data"}</Text>
                                            <CopyButton value={"LKDGNDDZ8IBYP9HA"}>
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
                                    {/* {item.uninstalledTime && */}
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Time</Text>
                                            <Text size="md" fw={500}>{removeTime(new Date('01/01/2000'), "/")}</Text>
                                        </Box>
                                    {/* } */}
                                </Group>
                                <Group>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                        <Text size="md" fw={500}>{removeTime(new Date("01/01/2000" || Date.now()), "/")}</Text>
                                    </Box>
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
                                        <Box m={20}>
                                            <div>
                                                <Group mb={15}>
                                                    {/* <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{data?.name}</Text>
                                            <StatusBadge statusName={data?.shopStatus ? data.shopStatus : "None"} /> */}
                                                    <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>Shop name</Text>
                                                    <StatusBadge statusName={"None"} />
                                                </Group>
                                                <Group>
                                                    <MdAccountCircle style={{ width: 18, height: 18 }} />
                                                    {/* Shop Manager: <Text size="md">{data?.shopManager ? data?.shopManager.name : "None"}</Text> */}
                                                    Shop Manager: <Text size="md">{"None"}</Text>
                                                </Group>
                                                <Group>
                                                    <MdOutlineAccessTime />
                                                    {/* <Text size="md">Open: {data?.openTime || "No Data"} - Close: {data?.closeTime || "No Data"}</Text> */}
                                                    <Text size="md">Open: {"No Data"} - Close: {"No Data"}</Text>
                                                </Group>

                                                {/* {data?.phone &&
                                            <Group>
                                                <MdPhone style={{ width: 18, height: 18 }} />
                                                <Text size="md">{data?.phone}</Text>
                                            </Group>
                                        } */}
                                                <Group>
                                                    <MdPhone style={{ width: 18, height: 18 }} />
                                                    <Text size="md">Phone</Text>
                                                </Group>
                                                {/* {(data?.ward || data?.addressLine) &&
                                            <Group>
                                                <MdHome style={{ width: 18, height: 18 }} />
                                                {(data?.ward && data?.addressLine) && <Text size="md">{data.addressLine}, {data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                                {(data?.ward && !data?.addressLine) && <Text size="md">{data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                                {(!data?.ward && data?.addressLine) && <Text size="md">{data.addressLine}</Text>}
                                            </Group>
                                        } */}
                                                <Group>
                                                    <MdHome style={{ width: 18, height: 18 }} />
                                                    <Text size="md">"Address</Text>
                                                </Group>
                                                {/* {data?.createdDate &&
                                            <Group mb={20}>
                                                <MdAccessTime style={{ width: 18, height: 18 }} />
                                                <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                            </Group>
                                        } */}
                                                <Group mb={20}>
                                                    <MdAccessTime style={{ width: 18, height: 18 }} />
                                                    <Text size="md">Created on: 01/01/2000</Text>
                                                </Group>
                                            </div>
                                            <Button>
                                                Huh
                                            </Button>
                                        </Box>
                                    </Tabs.Panel>

                                    {/* Edge Box Tab */}
                                    <Tabs.Panel value="edge box">
                                        <Flex justify={"space-between"} mt={20} ml={10}>
                                            <Flex justify={"space-between"} mr={10}>
                                                <div>
                                                    <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"} mb={10}>Name</Text>
                                                    <Flex wrap="wrap" justify="space-between" gap="md">
                                                        {/* {data?.edgeBoxStatus && */}
                                                        <Box mb={10} ml={5}>
                                                            <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                                                            <StatusBadge statusName={"Status"} padding={10} size="sm" tooltip="Edge Box Status" />
                                                        </Box>
                                                        {/* } */}
                                                        {/* {data?.edgeBoxLocation && */}
                                                        <Box mb={10} ml={5}>
                                                            <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                                                            <StatusBadge statusName={"Status"} padding={10} size="sm" tooltip="Location Status" />
                                                        </Box>
                                                        {/* } */}
                                                        {/* {data?.version && */}
                                                        <Box mb={10} ml={5}>
                                                            <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                                                            <Text size="md" fw={500}>{"Status"}</Text>
                                                        </Box>
                                                        {/* } */}
                                                        {/* {data?.createdDate && */}
                                                        <Box mb={10} ml={5}>
                                                            <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                                            <Text size="md" fw={500}>{removeTime(new Date(Date.now()), "/")}</Text>
                                                        </Box>
                                                        {/* } */}
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
                                                        <Text size="md" fw={500}>{"Name"}</Text>
                                                    </Box>
                                                </Group>

                                                {/* {data?.edgeBoxModel?.description && */}
                                                <>
                                                    <Divider mb={10} />
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Description</Text>
                                                        <Text size="sm" mb={10}>Description</Text>
                                                    </Box>
                                                </>
                                                {/* } */}
                                                <Divider mb={10} />
                                                <Group grow mb={15}>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Model code</Text>
                                                        <Text size="md" fw={500}>{"No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Manufacturer</Text>
                                                        <Text size="md" fw={500}>{"No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Storage</Text>
                                                        <Text size="md" fw={500}>{"No Data"}</Text>
                                                    </Box>
                                                </Group>
                                                <Group grow>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>CPU</Text>
                                                        <Text size="md" fw={500}>{"No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>RAM</Text>
                                                        <Text size="md" fw={500}>{"No Data"}</Text>
                                                    </Box>
                                                    <Box>
                                                        <Text size="xs" c={"dimmed"} fw={500}>OS</Text>
                                                        <Text size="md" fw={500}>{"No Data"}</Text>
                                                    </Box>
                                                </Group>
                                            </Box>
                                        </Flex>
                                    </Tabs.Panel>

                                    {/* Activity Tab */}
                                    <Tabs.Panel value="activities">
                                        <ActivityList activityList={data} />
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
