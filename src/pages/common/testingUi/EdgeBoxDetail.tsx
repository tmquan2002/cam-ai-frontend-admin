import { ActionIcon, Box, Button, Card, Divider, Group, Menu, Modal, Text, Tooltip, rem, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import { MdDelete, MdEdit, MdOutlineAccessTime, MdPageview, MdPhone } from "react-icons/md";
import { data, dataInstall } from "../../../assets/fakeData/fakeData";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { EdgeBoxStatus } from "../../../types/enum";
import { removeTime } from "../../../utils/dateFunction";
import styled from "./edgeboxdetail.module.scss";
import styledList from "./list.module.scss";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Edge Box",
        link: "/edgebox"
    },
    {
        title: "Detail"
    }
]

const EdgeBoxDetail = () => {

    const [modalDeleteOpen, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [modalupdateOpen, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <>
            <div className={styled["container-right"]}>
                <Navbar items={breadcrumbs} goBack />
                {/* <Box className={styled["loader"]}>
                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    </Box> */}
                <div className={styled["container-detail"]}>
                    {/* <Text fs="italic" ta="center">Edge Box not found</Text> */}
                    <>
                        <div className={styled["profile-header"]}>
                            <div className={styled["profile-header-left"]}>
                                <div>
                                    <Group mb={15}>
                                        <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"}>{data?.name}</Text>
                                        <StatusBadge statusName={data?.edgeBoxStatus ? data.edgeBoxStatus : "None"} padding={10} />
                                    </Group>
                                    {data?.edgeBoxLocation &&
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                                            <StatusBadge statusName={data?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                                        </Box>
                                    }
                                    {data?.version &&
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                                            <Text size="md" fw={500}>{data?.version}</Text>
                                        </Box>
                                    }
                                    {data?.createdDate &&
                                        <Box mb={10}>
                                            <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                            <Text size="md" fw={500}>{removeTime(new Date(data?.createdDate || Date.now()), "/")}</Text>
                                        </Box>
                                    }
                                </div>
                            </div>
                            <div className={styled["model-detail"]}>

                                <Text fw={500} size="md" mb={10} c={"light-blue.6"}>Model Information</Text>
                                <Group grow mb={10} mt={10}>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>Name</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.name}</Text>
                                    </Box>
                                </Group>

                                {data?.edgeBoxModel?.description &&
                                    <>
                                        <Divider mb={10} />
                                        <Box>
                                            <Text size="xs" c={"dimmed"} fw={500}>Description</Text>
                                            <Text size="sm" mb={10}>{data?.edgeBoxModel?.description}</Text>
                                        </Box>
                                    </>
                                }
                                <Divider mb={10} />
                                <Group grow mb={15}>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>Model code</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.modelCode || "No Data"}</Text>
                                    </Box>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>Manufacturer</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.manufacturer || "No Data"}</Text>
                                    </Box>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>Storage</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.storage || "No Data"}</Text>
                                    </Box>
                                </Group>
                                <Group grow>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>CPU</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.cpu || "No Data"}</Text>
                                    </Box>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>RAM</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.ram || "No Data"}</Text>
                                    </Box>
                                    <Box>
                                        <Text size="xs" c={"dimmed"} fw={500}>OS</Text>
                                        <Text size="md" fw={500}>{data?.edgeBoxModel?.os || "No Data"}</Text>
                                    </Box>
                                </Group>

                            </div>
                            <div>
                                <Menu shadow="md" width={200} offset={{ crossAxis: -80 }}>
                                    <Menu.Target>
                                        <Tooltip label="Actions" withArrow>
                                            <ActionIcon variant="transparent"
                                                color={computedColorScheme === "dark" ? "white" : "black"}
                                                size={"md"}>
                                                <IconDots style={{ width: 25, height: 25 }} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        {/* <Menu.Label>Actions</Menu.Label> */}
                                        <Menu.Item leftSection={<MdEdit />}
                                            onClick={openUpdate}>
                                            Edit Info
                                        </Menu.Item>
                                        <Menu.Item leftSection={<MdEdit />}
                                            onClick={openUpdate}>
                                            Update Location
                                        </Menu.Item>
                                        {/* <Menu.Label>Danger zone</Menu.Label> */}
                                        <Menu.Item color="red" leftSection={<MdDelete style={{ color: data?.edgeBoxStatus == EdgeBoxStatus.Inactive ? "grey" : "red" }} />}
                                            disabled={data?.edgeBoxStatus == EdgeBoxStatus.Inactive}
                                            onClick={openDelete} >
                                            Delete
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                    </>
                </div>

                <div className={styled["container-detail"]}>
                    <>
                        <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"} mb={10}>Current Active Install</Text>
                        <Group grow mb={15}>
                            <Box mb={10}>
                                <Text size="xs" c={"dimmed"} fw={500}>Install Status</Text>
                                <StatusBadge statusName={dataInstall?.values[0].edgeBoxInstallStatus} padding={10} size="sm" tooltip="Location Status" />
                            </Box>
                            <Box mb={10}>
                                <Text size="xs" c={"dimmed"} fw={500}>Acivation Status</Text>
                                <StatusBadge statusName={dataInstall?.values[0].activationStatus} padding={10} size="sm" tooltip="Location Status" />
                            </Box>
                        </Group>
                        <Group grow mb={15}>
                            {dataInstall?.values[0]?.uninstalledTime &&
                                <Box mb={10}>
                                    <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Time</Text>
                                    <Text size="md" fw={500}>{removeTime(new Date(dataInstall?.values[0]?.uninstalledTime), "/")}</Text>
                                </Box>
                            }
                            <Box>
                                <Text size="xs" c={"dimmed"} fw={500}>Installed Date</Text>
                                <Text size="md" fw={500}>{removeTime(new Date(dataInstall?.values[0]?.createdDate || Date.now()), "/")}</Text>
                            </Box>
                        </Group>
                    </>
                </div>

                <div className={styled["container-detail"]}>
                    <>
                        <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Installed Shops</Text>
                        <div className={styledList["list-container"]}>
                            <div className={styledList["card-detail"]}>

                            </div>
                        </div>
                    </>
                </div>

                <>
                    <div className={styled["container-detail"]}>
                        <div>
                            <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Installed Shops</Text>

                            <div className={styledList["list-container"]}>
                                <div className={styledList["card-detail"]}>
                                    <Box mt={10}>
                                        {dataInstall?.values?.map((item, index) => (
                                            <Card shadow="sm" padding="lg" radius="md" m={10} key={index}
                                                style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                                                <Group mb={10} justify="space-between">
                                                    <Group>
                                                        <Text fw={500} size="lg">{item.shop.name}</Text>
                                                        {item.shop.shopStatus &&
                                                            <StatusBadge statusName={item?.shop.shopStatus} padding={10} size="sm" />
                                                        }
                                                    </Group>
                                                    <ActionIcon.Group>
                                                        <Tooltip label="View Edge Box" withArrow>
                                                            <ActionIcon variant="filled" size="lg" aria-label="View Edge Box" color="light-blue.6"
                                                                onClick={() => { }}>
                                                                <MdPageview style={{ width: rem(20) }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>

                                                        <Tooltip label="Uninstall" withArrow>
                                                            <ActionIcon variant="filled" size="lg" aria-label="Uninstall" color="pale-red.4">
                                                                <MdDelete style={{ width: rem(20) }} stroke={1.5} />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </ActionIcon.Group>
                                                </Group>

                                                <div className={styledList["icon-text"]}>
                                                    <MdOutlineAccessTime style={{ width: '20px', height: '20px' }} />
                                                    <span className={styledList["information"]}><b>Open:</b> {item?.shop.openTime || "No Data"} - <b>Close:</b> {item?.shop.closeTime || "No Data"}</span>
                                                </div>

                                                {item.shop.phone &&
                                                    <div className={styledList["icon-text"]}>
                                                        <MdPhone style={{ width: '20px', height: '20px' }} />
                                                        <span className={styledList["information"]}>{item.shop.phone}</span>
                                                    </div>
                                                }
                                            </Card>
                                        ))}
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <Box className={styled["loader"]}>
                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    </Box> */}
                </>
            </div>
            <Modal opened={modalDeleteOpen} onClose={closeDelete}
                title="Delete this edge box?" centered>
                <Text>
                    Do you want to remove this edge box?
                </Text>
                <Group align="end">
                    <Button
                        variant="outline" size="md" mt={20} onClick={closeDelete}
                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        variant="gradient" size="md" mt={20} onClick={() => { }}
                        gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                    >
                        DELETE
                    </Button>
                </Group>
            </Modal>
            <Modal opened={modalupdateOpen} onClose={closeUpdate}
                title="Update Model" centered>
                <div>There's a form here</div>
            </Modal>
        </>
    );
};

export default EdgeBoxDetail;
