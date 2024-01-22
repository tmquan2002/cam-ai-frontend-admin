import { ActionIcon, Badge, Box, Button, Divider, Group, LoadingOverlay, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useDeleteAccount, useGetAccountById } from "../../../hooks/useAccounts";
import { removeTime } from "../../../utils/dateFormat";
import styled from "./styles/accountdetail.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Account",
        link: "/account"
    },
    {
        title: "Detail"
    }
]

const AccountDetail = () => {

    const params = useParams();
    const navigate = useNavigate();
    // console.log(params);
    const [modalOpen, { open, close }] = useDisclosure(false);

    const {
        data,
        isLoading
    } = useGetAccountById(params.accountId!);

    const { mutate: deleteAccount } = useDeleteAccount();

    const onDelete = () => {
        deleteAccount(params.accountId!, {
            onSuccess() {
                navigate('/account')
                notifications.show({
                    message: "Account disabled!",
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
                        message: "Something wrong happen when trying to remove this account",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                close();
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
                    </Box>
                    :
                    <div className={styled["container-detail"]}>
                        {/* <Image h={150} mb={20} src={data?.logoUri} /> */}
                        <div className={styled["profile-header"]}>
                            <div className={styled["profile-header-left"]}>
                                <div>
                                    <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                    <Text size="sm">{data?.email}</Text>
                                    <Text size="xs" mb={20}>Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                    <Group>
                                        {data!.roles.map((item, index) => (
                                            <Badge size='lg' radius={"lg"} color="shading.9" key={index}>
                                                {item.name}
                                            </Badge>
                                        ))}
                                    </Group>
                                </div>
                            </div>
                            <Group>
                                <Badge size='lg' radius={"lg"} color="light-yellow.7">
                                    {data?.accountStatus ? data.accountStatus.name : "None"}
                                </Badge>
                                <Tooltip label="Update" withArrow>
                                    <ActionIcon
                                        size="xl" aria-label="Logout" color={"light-yellow.9"}
                                        onClick={() => navigate(`/account/${params.accountId!}/update`)}
                                    >
                                        <MdEdit style={{ width: 18, height: 18 }} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                        size="xl" aria-label="Logout" color={"pale-red.7"}
                                        onClick={open}
                                    >
                                        <MdDelete style={{ width: 18, height: 18 }} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </div>
                        <Divider my="md" />
                        {/* TODO: Add a list of shops this brand/brand manager account has */}
                        <div className={styled["profile-detail"]}>
                            <Text>{data?.phone}</Text>
                        </div>
                    </div>
                }
            </div>
            <Modal opened={modalOpen} onClose={close} title="Delete this account?" centered>
                <Text>
                    Do you want to remove this brand? This action will switch a brand status to <b>INACTIVE</b>
                </Text>
                <Group>
                    <Button
                        variant="gradient" size="md" mt={20} onClick={onDelete}
                        gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                    >
                        DELETE
                    </Button>
                    <Button
                        variant="outline" size="md" mt={20} onClick={close}
                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                    >
                        CANCEL
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

export default AccountDetail;
