import { ActionIcon, Box, Button, Group, LoadingOverlay, Menu, Modal, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import axios from "axios";
import { GoVersions } from "react-icons/go";
import { MdAccessTime, MdDelete, MdEdit, MdInfo, MdMyLocation } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopListByEdgeBox } from "../../../components/list/ShopListById";
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
                                                <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                                <StatusBadge statusName={data?.edgeBoxStatus ? data.edgeBoxStatus : "None"} type="edgebox" />
                                            </Group>
                                            {data?.version &&
                                                <Group mb={10}>
                                                    <GoVersions />
                                                    <Text size="md">Version: {data?.version}</Text>
                                                </Group>
                                            }
                                            {data?.edgeBoxLocation &&
                                                <Group mb={10}>
                                                    <MdMyLocation />
                                                    <Text size="md">Location: {data?.edgeBoxLocation}</Text>
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
                                                <Menu.Item leftSection={<MdEdit />}
                                                    onClick={openUpdate}>
                                                    Update
                                                </Menu.Item>
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
                                    <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>MODEL</Text>
                                    <div className={styled["model-detail"]}>
                                        <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.edgeBoxModel?.name}</Text>
                                        {data?.edgeBoxModel?.description &&
                                            <Text size="md" mb={20}>{data?.edgeBoxModel?.description}</Text>
                                        }
                                        <Group mb={5}>
                                            <MdInfo />
                                            <Text size="md">Stats: </Text>
                                        </Group>
                                        <Group justify="space-between" gap={0}>
                                            <Text size="md"><b>Model code:</b> {data?.edgeBoxModel?.modelCode || "No Data"}</Text>
                                            <Text size="md"><b>Manufacturer:</b> {data?.edgeBoxModel?.manufacturer || "No Data"}</Text>
                                            <Text size="md"><b>Storage:</b> {data?.edgeBoxModel?.storage || "No Data"}</Text>
                                        </Group>
                                        <Group justify="space-between" gap={0}>
                                            <Text size="md"><b>CPU:</b> {data?.edgeBoxModel?.cpu || "No Data"}</Text>
                                            <Text size="md"><b>RAM:</b> {data?.edgeBoxModel?.ram || "No Data"}</Text>
                                            <Text size="md"><b>OS:</b> {data?.edgeBoxModel?.os || "No Data"}</Text>
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
                                    <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>INSTALLED SHOPS</Text>
                                    <ShopListByEdgeBox data={dataInstall.values} />
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
