import { ActionIcon, Box, Button, CopyButton, Divider, Grid, Group, LoadingOverlay, Modal, Select, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { MdCheck, MdContentCopy, MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopLongListByEdgeBox } from "../../../components/list/ShopLongListById";
import { CustomModal } from "../../../components/modal/CustomSimleModel";
import Navbar from "../../../components/navbar/Navbar";
import { useGetInstallByEdgeBoxId } from "../../../hooks/useEdgeBoxInstalls";
import { useDeleteEdgeBox, useGetEdgeBoxById, useUpdateEdgeBoxLocation, useUpdateEdgeBoxStatus } from "../../../hooks/useEdgeBoxes";
import { EdgeBoxInstallStatus, EdgeBoxLocationStatus, EdgeBoxStatus, StatusColor } from "../../../types/enum";
import { removeTime } from "../../../utils/dateTimeFunction";
import { ShopEdgeBoxAssignForm } from "../shop/components/ShopEdgeBoxAssignForm";
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

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const params = useParams();
    const navigate = useNavigate();

    const [modalDeleteOpen, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [modalUpdateOpen, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);
    const [modalAssignOpen, { open: openAssign, close: closeAssign }] = useDisclosure(false);
    const [modalStatusOpen, { open: openStatus, close: closeStatus }] = useDisclosure(false);

    const { isLoading, data, refetch, error } = useGetEdgeBoxById(params.edgeBoxId!);
    const { isLoading: isLoadingInstall, data: dataInstall, refetch: refetchInstall } = useGetInstallByEdgeBoxId(params.edgeBoxId!);
    const { mutate: deleteEdgeBox, isLoading: isLoadingDelete } = useDeleteEdgeBox();
    const { mutate: updateLocation, isLoading: isLoadingLocation } = useUpdateEdgeBoxLocation();
    const { mutate: updateStatus, isLoading: isLoadingStatus } = useUpdateEdgeBoxStatus();

    const isAllInstallsDisabled = dataInstall?.values.filter((e) => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).length === 0;
    const isEdgeBoxActive = data?.edgeBoxStatus === EdgeBoxStatus.Active;
    const isEdgeBoxBroken = data?.edgeBoxStatus === EdgeBoxStatus.Broken;
    const isEdgeBoxDisposed = data?.edgeBoxStatus === EdgeBoxStatus.Disposed;

    const form = useForm<{ edgeBoxStatus: EdgeBoxStatus | null }>({
        initialValues: {
            edgeBoxStatus: null
        },

        validate: {
            edgeBoxStatus: isNotEmpty("Please select a status")
        },
    });

    const onDelete = () => {
        deleteEdgeBox(params.edgeBoxId!, {
            onSuccess() {
                navigate('/edgebox')
                notifications.show({
                    title: "Successfully",
                    message: "Edge box removed!",
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
                        message: "Something wrong happen when trying to remove this edge box",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                closeDelete();
            },
        });
    }

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

    const onUpdateStatus = () => {
        const updateStatusParams = {
            id: params.edgeBoxId!,
            values: { status: form.values.edgeBoxStatus }
        }
        updateStatus(updateStatusParams, {
            onSuccess() {
                refetch();
                closeStatus();
                notifications.show({
                    title: "Successfully",
                    message: "Status Changed Successful!",
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
                                    <Box>
                                        <Group justify="space-between" gap={0} mb={10}>
                                            <Text size='md' fw={'bold'} fz={22} c={"light-blue.6"} mr={20} mb={10}>{data?.name}</Text>
                                            {data?.edgeBoxStatus && data?.edgeBoxStatus !== EdgeBoxStatus.Disposed &&
                                                <Button variant="gradient" size="xs" onClick={openStatus} mb={10}
                                                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                                                >
                                                    Change Status
                                                </Button>
                                            }
                                        </Group>
                                        <Grid justify="space-between">
                                            <Grid.Col span={12}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>ID</Text>
                                                    <Group>
                                                        <Text size="md" fw={500}>{data?.id || "No Data"}</Text>
                                                        <CopyButton value={data?.id}>
                                                            {({ copied, copy }) => (
                                                                <Tooltip label={copied ? 'Copied' : 'Copy id'} withArrow>
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
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                                                    <StatusBadge statusName={data?.edgeBoxStatus || "None"} padding={10} size="sm" tooltip="Edge Box Status" />
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                                                    <StatusBadge statusName={data?.edgeBoxLocation || "None"} padding={10} size="sm" tooltip="Location Status" />
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                                                    <Text size="md" fw={500}>{data?.version || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Serial Number</Text>
                                                    <Text size="md" fw={500}>{data?.serialNumber || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>MAC Address</Text>
                                                    <Text size="md" fw={500}>{data?.macAddress || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                                                    <Text size="md" fw={500}>{data?.createdDate ? removeTime(new Date(data?.createdDate), "/") : "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>

                                    {/* Edge Box Status model section */}
                                    <Modal onClose={closeStatus} opened={modalStatusOpen} title="Change Edge Box Status" centered>
                                        <form>
                                            <Select
                                                placeholder="Select a status"
                                                label="Edge Box Status"
                                                data={[
                                                    {
                                                        label: EdgeBoxStatus.Active, value: EdgeBoxStatus.Active,
                                                        disabled: isEdgeBoxDisposed
                                                    },
                                                    {
                                                        label: EdgeBoxStatus.Inactive, value: EdgeBoxStatus.Inactive,
                                                        disabled: !isEdgeBoxActive || !isAllInstallsDisabled
                                                    },
                                                    {
                                                        label: EdgeBoxStatus.Broken, value: EdgeBoxStatus.Broken,
                                                        disabled: !isEdgeBoxActive
                                                    },
                                                    {
                                                        label: EdgeBoxStatus.Disposed, value: EdgeBoxStatus.Disposed,
                                                        disabled: !(isEdgeBoxActive || isEdgeBoxBroken) && isAllInstallsDisabled
                                                    },
                                                ]}
                                                {...form.getInputProps("edgeBoxStatus")}
                                            />
                                            <Group>
                                                <Button
                                                    onClick={onUpdateStatus}
                                                    variant="gradient" loading={isLoadingStatus}
                                                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }} size="md" mt={20}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="outline" size="md" mt={20} onClick={closeStatus} loading={isLoadingStatus}
                                                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Group>
                                        </form>
                                    </Modal>

                                    <Divider orientation="vertical" ml={15} mr={15} />
                                    {/* Edge Box Model section */}
                                    <div className={styled["model-detail"]}>
                                        <Group justify="space-between">
                                            <Text size='md' fw="bold" fz={20} c={"light-blue.4"}>Model</Text>
                                            <Group>
                                                {data?.edgeBoxLocation == EdgeBoxLocationStatus.Installing &&
                                                    <Button
                                                        onClick={() => onUpdateLocation(EdgeBoxLocationStatus.Installing)} variant="filled"
                                                        color={StatusColor.ACTIVE} size="sm" loading={isLoadingLocation}
                                                    >
                                                        Finish Installing
                                                    </Button>
                                                }
                                                {data?.edgeBoxLocation == EdgeBoxLocationStatus.Uninstalling &&
                                                    <Button
                                                        onClick={() => onUpdateLocation(EdgeBoxLocationStatus.Uninstalling)} variant="filled"
                                                        color={StatusColor.ACTIVE} size="sm" loading={isLoadingLocation}
                                                    >
                                                        Finish Uninstalling
                                                    </Button>
                                                }
                                                {(dataInstall?.values.filter(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).length == 0
                                                    && data?.edgeBoxLocation !== EdgeBoxLocationStatus.Uninstalling && data?.edgeBoxStatus === EdgeBoxStatus.Active) &&
                                                    <Button
                                                        onClick={openAssign} variant="gradient"
                                                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }} size="sm"
                                                    >
                                                        Assign to Shop
                                                    </Button>
                                                }
                                                <ActionIcon.Group>
                                                    <Tooltip label="Edit Edge Box information" withArrow>
                                                        <ActionIcon variant="outline" size="lg" aria-label="Edit Edge Box information" color="light-blue.6"
                                                            onClick={openUpdate}>
                                                            <MdEdit />
                                                        </ActionIcon>
                                                    </Tooltip>

                                                    <Tooltip label="Delete Edge Box" withArrow>
                                                        <ActionIcon variant="outline" size="lg" aria-label="Delete Edge Box" color="pale-red.4"
                                                            onClick={openDelete}>
                                                            <MdDelete />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </ActionIcon.Group>
                                            </Group>
                                        </Group>
                                        <Group grow mb={10} mt={10}>
                                            <Box ml={5}>
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
                                        <Grid>
                                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Model code</Text>
                                                    <Text size="md" fw={500}>{data?.edgeBoxModel?.modelCode || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Manufacturer</Text>
                                                    <Text size="md" fw={500}>{data?.edgeBoxModel?.manufacturer || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>Storage</Text>
                                                    <Text size="md" fw={500}>{data?.edgeBoxModel?.storage || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>CPU</Text>
                                                    <Text size="md" fw={500}>{data?.edgeBoxModel?.cpu || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>RAM</Text>
                                                    <Text size="md" fw={500}>{data?.edgeBoxModel?.ram || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                                                <Box mb={10} ml={5}>
                                                    <Text size="xs" c={"dimmed"} fw={500}>OS</Text>
                                                    <Text size="md" fw={500}>{data?.edgeBoxModel?.os || "No Data"}</Text>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                }

                {/* Install section */}
                {data && dataInstall && dataInstall?.values?.length > 0 &&
                    <>
                        {!isLoadingInstall ?
                            <div className={styled["container-detail"]}>
                                <div>
                                    <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Shop Installed</Text>
                                    <ShopLongListByEdgeBox edgeBoxLocation={data.edgeBoxLocation} dataInstalls={dataInstall} refetch={refetch} refetchInstall={refetchInstall} />
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

            {/* Modal section*/}
            {/* Delete */}
            <CustomModal cancelLabel="Cancel" onClickAction={onDelete} onClose={closeDelete} opened={modalDeleteOpen} label="Delete" topTitle="Remove Edge Box"
                title="Do you want to remove this edge box?" centered loading={isLoadingDelete} />

            {/* Update Info */}
            <Modal opened={modalUpdateOpen} onClose={closeUpdate}
                title="Update Edge Box Model" centered>
                <UpdateEdgeBoxForm id={params.edgeBoxId!} close={closeUpdate} refetch={refetch} refetchInstall={refetchInstall} />
            </Modal>

            {/* Modal Assign Section */}
            <Modal opened={modalAssignOpen} onClose={closeAssign}
                title="Assign to Shop" centered>
                <ShopEdgeBoxAssignForm edgeBoxId={params.edgeBoxId!} close={closeAssign} refetch={refetch} refetchInstall={refetchInstall} />
            </Modal>
        </>
    );
};

export default EdgeBoxDetail;
