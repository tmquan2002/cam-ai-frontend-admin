import { ActionIcon, Box, Button, Divider, Flex, Group, LoadingOverlay, Modal, Text, Tooltip, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopLongListByEdgeBox } from "../../../components/list/ShopLongListById";
import Navbar from "../../../components/navbar/Navbar";
import { useDeleteEdgeBox, useGetEdgeBoxById, useGetEdgeBoxInstallByEdgeBoxId, useUpdateEdgeBoxLocation } from "../../../hooks/useEdgeBoxes";
import { EdgeBoxLocationStatus, StatusColor } from "../../../types/enum";
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
    const { mutate: deleteEdgeBox, isLoading: isLoadingDelete } = useDeleteEdgeBox();
    const { mutate: updateLocation, isLoading: isLoadingLocation } = useUpdateEdgeBoxLocation();

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

    const onUpdateLocation = () => {
        const updateLocationParams = {
            id: params.edgeBoxId!,
            values: {
                location: EdgeBoxLocationStatus.Occupied
            }
        }
        updateLocation(updateLocationParams, {
            onSuccess() {
                refetch()
                notifications.show({
                    message: "Edge Box finished installing!",
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
                        message: "Something wrong happen when trying to finish installing this edge box",
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
                {(isLoading || !data?.edgeBoxModel) ?
                    <Box className={styled["loader"]}>
                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    </Box> :
                    <div className={styled["container-detail"]}>
                        {error ? <Text fs="italic" ta="center">Edge Box not found</Text> :
                            <>
                                <div className={styled["profile-header"]}>
                                    {/* Edge Box section */}
                                    <div className={styled["profile-header-left"]}>
                                        <div>
                                            <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"} mb={10}>{data?.name}</Text>
                                            <Flex wrap="wrap" justify="space-between" gap="md">
                                                {data?.edgeBoxStatus &&
                                                    <Box mb={10} ml={5}>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                                                        <StatusBadge statusName={data?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                                                    </Box>
                                                }
                                                {data?.edgeBoxLocation &&
                                                    <Box mb={10} ml={5}>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                                                        <StatusBadge statusName={data?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                                                    </Box>
                                                }
                                                {data?.version &&
                                                    <Box mb={10} ml={5}>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                                                        <Text size="md" fw={500}>{data?.version}</Text>
                                                    </Box>
                                                }
                                                {data?.createdDate &&
                                                    <Box mb={10} ml={5}>
                                                        <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                                        <Text size="md" fw={500}>{removeTime(new Date(data?.createdDate || Date.now()), "/")}</Text>
                                                    </Box>
                                                }
                                            </Flex>
                                        </div>
                                    </div>
                                    <Divider orientation="vertical" ml={10} mr={10} />
                                    {/* Model section */}
                                    <div className={styled["model-detail"]}>
                                        <Group justify="space-between">
                                            <Text size='sm' fw="bold" fz={20} c={"light-blue.4"}>Model</Text>
                                            <Group>
                                                {data?.edgeBoxLocation == EdgeBoxLocationStatus.Installing &&
                                                    <Button
                                                        onClick={() => onUpdateLocation()} variant="filled"
                                                        color={StatusColor.ACTIVE} size="sm" loading={isLoadingLocation}
                                                    >
                                                        Finish Installing
                                                    </Button>
                                                }
                                                {data?.edgeBoxLocation == EdgeBoxLocationStatus.Occupied &&
                                                    <Button
                                                        onClick={() => notifications.show({
                                                            message: "This feature is in development",
                                                            color: "pale-red.5",
                                                            withCloseButton: true,
                                                        })} variant="filled"
                                                        color="pale-red.4" size="sm" loading={isLoadingLocation}
                                                    >
                                                        Uninstall
                                                    </Button>
                                                }
                                                <ActionIcon.Group>
                                                    <Tooltip label="Edit Edge Box information" withArrow>
                                                        <ActionIcon variant="outline" size="lg" aria-label="Edit Edge Box information" color="light-blue.6"
                                                            onClick={openUpdate}>
                                                            <MdEdit style={{ width: rem(20) }} />
                                                        </ActionIcon>
                                                    </Tooltip>

                                                    <Tooltip label="Delete Edge Box" withArrow>
                                                        <ActionIcon variant="outline" size="lg" aria-label="Delete Edge Box" color="pale-red.4"
                                                            onClick={openDelete}>
                                                            <MdDelete style={{ width: rem(20) }} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </ActionIcon.Group>
                                            </Group>
                                        </Group>
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
                                </div>
                            </>
                        }
                    </div>
                }

                {dataInstall && dataInstall?.values?.length > 0 &&
                    <>
                        {!isLoadingInstall ?
                            <div className={styled["container-detail"]}>
                                <div>
                                    <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Installs</Text>
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
                        loading={isLoadingDelete}
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
