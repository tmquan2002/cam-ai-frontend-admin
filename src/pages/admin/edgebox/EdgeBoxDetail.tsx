import { ActionIcon, Box, Button, Divider, Group, LoadingOverlay, Menu, Modal, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import axios from "axios";
import { GoVersions } from "react-icons/go";
import { MdAccessTime, MdDelete, MdEdit, MdLocationOn } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopLongListByEdgeBox } from "../../../components/list/ShopLongListById";
import Navbar from "../../../components/navbar/Navbar";
import { useDeleteEdgeBox, useGetEdgeBoxById, useGetEdgeBoxInstallByEdgeBoxId } from "../../../hooks/useEdgeBoxes";
import { EdgeBoxStatus } from "../../../types/enum";
import { removeTime } from "../../../utils/dateFunction";
import { UpdateEdgeBoxForm } from "./components/UpdateEdgeBoxForm";
import styled from "./styles/edgeboxdetail.module.scss";
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

    const params = useParams();
    const navigate = useNavigate();

    const [modalDeleteOpen, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [modalupdateOpen, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);


    const { isLoading, data, refetch, error } = useGetEdgeBoxById(params.edgeBoxId!);
    const { isLoading: isLoadingInstall, data: dataInstall, refetch: refetchInstall } = useGetEdgeBoxInstallByEdgeBoxId(params.edgeBoxId!);
    const { mutate: deleteEdgeBox } = useDeleteEdgeBox();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onDelete = () => {
        deleteEdgeBox(params.edgeBoxId!, {
            onSuccess() {
                navigate('/edgebox')
                notifications.show({
                    message: "Edge box disposed!",
                    color: "green",
                    withCloseButton: true,
                });
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    console.error(error);
                    notifications.show({
                        message: "Something wrong happen when trying to remove this edge box",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                closeDelete();
            },
        });
    }

    return (
        <>
            <div className={styled["container-right"]}>
                <Navbar items={breadcrumbs} goBack />
                {isLoading ?
                    <Box className={styled["loader"]}>
                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    </Box> :
                    <div className={styled["container-detail"]}>
                        {error ? <Text fs="italic" ta="center">Edge Box not found</Text> :
                            <>
                                <div className={styled["profile-header"]}>
                                    <div className={styled["profile-header-left"]}>
                                        <div>
                                            <Group mb={15}>
                                                <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{data?.name}</Text>
                                                <StatusBadge statusName={data?.edgeBoxStatus ? data.edgeBoxStatus : "None"} />
                                            </Group>
                                            {data?.edgeBoxLocation &&
                                                <Group mb={10}>
                                                    <MdLocationOn />
                                                    <Text size="md">Location status</Text>
                                                    <StatusBadge statusName={data?.edgeBoxLocation} padding={10} ml={10} size="sm" tooltip="Location Status" />
                                                </Group>
                                            }
                                            {data?.version &&
                                                <Group mb={10}>
                                                    <GoVersions />
                                                    <Text size="md">Version: {data?.version}</Text>
                                                </Group>
                                            }
                                            {data?.createdDate &&
                                                <Group mb={10}>
                                                    <MdAccessTime />
                                                    <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                                </Group>
                                            }
                                        </div>
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
                        }
                    </div>
                }

                {data?.edgeBoxModel &&
                    <>
                        {!isLoading ?
                            <div className={styled["container-detail"]}>
                                <div>
                                    <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Model</Text>
                                    <div className={styled["model-detail"]}>
                                        <Group grow mb={10}>
                                            <Box>
                                                <Text size="xs" c={"dimmed"} fw={500}>Name</Text>
                                                <Text size="md" fw={500}>{data?.edgeBoxModel?.name}</Text>
                                            </Box>
                                            {(dataInstall?.values && dataInstall?.values.length > 0) &&
                                                <Box>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Valid From</Text>
                                                    <Text size="md" fw={500}>{dataInstall?.values[0].validFrom || "No Data"}</Text>
                                                </Box>
                                            }
                                            {(dataInstall?.values && dataInstall?.values.length > 0) &&
                                                <Box>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Valid Until</Text>
                                                    <Text size="md" fw={500}>{dataInstall?.values[0].validUntil || "No Data"}</Text>
                                                </Box>
                                            }
                                        </Group>
                                        <Divider mb={10} />
                                        {data?.edgeBoxModel?.description &&
                                            <Box>
                                                <Text size="xs" c={"dimmed"} fw={500}>Description</Text>
                                                <Text size="sm" mb={10}>{data?.edgeBoxModel?.description}</Text>
                                            </Box>
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
                                </div>
                            </div>
                            :
                            <Box className={styled["loader"]}>
                                <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                            </Box>
                        }
                    </>
                }

                {dataInstall && dataInstall?.values?.length > 0 &&
                    <>
                        {!isLoadingInstall ?
                            <div className={styled["container-detail"]}>
                                <div>
                                    <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Installed Shops</Text>
                                    <ShopLongListByEdgeBox data={dataInstall.values} />
                                </div>
                            </div>
                            :
                            <Box className={styled["loader"]}>
                                <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                            </Box>
                        }
                    </>
                }
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
                        variant="gradient" size="md" mt={20} onClick={onDelete}
                        gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                    >
                        DELETE
                    </Button>
                </Group>
            </Modal>
            <Modal opened={modalupdateOpen} onClose={closeUpdate}
                title="Update Model" centered>
                <UpdateEdgeBoxForm id={params.edgeBoxId!} close={closeUpdate} refetch={refetch} refetchInstall={refetchInstall} />
            </Modal>
        </>
    );
};

export default EdgeBoxDetail;
