import { ActionIcon, Box, Button, Divider, Group, LoadingOverlay, Menu, Modal, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";
import { MdAccessTime, MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useDeleteEdgeBox, useGetEdgeBoxById } from "../../../hooks/useEdgeBoxes";
import { removeTime } from "../../../utils/dateFormat";
import styled from "./styles/edgeboxdetail.module.scss";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { UpdateEdgeBoxForm } from "./components/UpdateEdgeBoxForm";
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


    const { isLoading, data, refetch } = useGetEdgeBoxById(params.edgeBoxId!);
    const { mutate: deleteEdgeBox } = useDeleteEdgeBox();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onDelete = () => {
        deleteEdgeBox(params.edgeBoxId!, {
            onSuccess() {
                navigate('/edgebox')
                notifications.show({
                    message: "Edge box disabled!",
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
                        <div className={styled["profile-header"]}>
                            <div className={styled["profile-header-left"]}>
                                <div>
                                    <Group mb={15}>
                                        <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.model}</Text>
                                        <StatusBadge statusName={data?.edgeBoxStatus ? data.edgeBoxStatus.name : "None"} type="edgebox"
                                            statusId={data?.edgeBoxStatus?.id ? data?.edgeBoxStatus?.id : 0} />
                                    </Group>
                                    <Group mb={20}>
                                        <MdAccessTime />
                                        <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                    </Group>
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
                                        <Menu.Item color="red" leftSection={<MdDelete style={{ color: "red" }} />}
                                            onClick={openDelete} >
                                            Delete
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                        <Divider my="md" />
                        <div className={styled["profile-detail"]}>

                        </div>
                    </div>
                }
            </div>
            <Modal opened={modalDeleteOpen} onClose={closeDelete}
                title="Delete this edge box?" centered>
                <Text>
                    Do you want to remove this edge box? This action will switch a edge box status to <b>INACTIVE</b>
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
                <UpdateEdgeBoxForm id={params.edgeBoxId!} close={closeUpdate} refetch={refetch} />
            </Modal>
        </>
    );
};

export default EdgeBoxDetail;
