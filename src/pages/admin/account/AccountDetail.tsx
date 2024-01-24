import { ActionIcon, Badge, Box, Button, Divider, Group, LoadingOverlay, Menu, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { MdAccessTime, MdAccountCircle, MdCalendarToday, MdDelete, MdEdit, MdEmail, MdPhone, MdSettings } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopListById } from "../../../components/list/ShopListById";
import Navbar from "../../../components/navbar/Navbar";
import { useDeleteAccount, useGetAccountById } from "../../../hooks/useAccounts";
import { RoleEnum } from "../../../types/enum";
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

    const { data, isLoading } = useGetAccountById(params.accountId!);
    const { mutate: deleteAccount } = useDeleteAccount();

    console.log(data?.roles)

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
                            <div>
                                <Group>
                                    <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                    <Badge size='lg' radius={"lg"} color="shading.9">
                                        {data?.accountStatus ? data.accountStatus.name : "None"}
                                    </Badge>
                                </Group>

                                <Group>
                                    <MdEmail />
                                    <Text size="md">{data?.email}</Text>
                                </Group>

                                <Group>
                                    <MdPhone />
                                    <Text size="md">{data?.phone}</Text>
                                </Group>

                                <Group>
                                    <MdCalendarToday />
                                    <Text size="md">{data?.birthday}</Text>
                                </Group>

                                <Group>
                                    <MdAccountCircle />
                                    {data!.roles.map((item, index) => (
                                        <Text size="md" key={index}>{item.name}</Text>
                                    ))}
                                </Group>

                                <Group mb={20}>
                                    <MdAccessTime />
                                    <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                </Group>
                            </div>
                            <div>
                                <Menu shadow="md" width={200} offset={{crossAxis: -80}}>
                                    <Menu.Target>
                                        <Tooltip label="Settings" withArrow>
                                            <ActionIcon variant="transparent" color="grey" size={"md"}>
                                                <MdSettings style={{ width: 18, height: 18 }} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<MdEdit />}
                                            onClick={() => navigate(`/account/${params.accountId!}/update`)}>
                                            Update
                                        </Menu.Item>
                                        <Menu.Item color="red" leftSection={<MdDelete style={{ color: "red" }} />}
                                            onClick={open} >
                                            Delete
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                        <Divider my="md" />
                        {/* TODO: Add detail of a shop this shop manager account working on */}
                        {data?.roles.find(e => e.id == RoleEnum.BrandManager) && data?.brand?.id &&
                            <div className={styled["shop-detail"]}>
                                <ShopListById id={data?.brand.id} idType="brand" />
                            </div>
                        }
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
