import { ActionIcon, Avatar, Box, Button, Divider, Group, LoadingOverlay, Menu, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCake, IconClock, IconDots, IconEdit, IconGenderFemale, IconGenderMale, IconHome, IconMail, IconPhone, IconRepeat, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { MdAccessTime, MdHome, MdOutlineAccessTime, MdPhone } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopShortListById } from "../../../components/list/ShopShortListById";
import { CustomModal } from "../../../components/modal/CustomSimleModel";
import Navbar from "../../../components/navbar/Navbar";
import { useActivateAccount, useDeleteAccount, useGetAccountById } from "../../../hooks/useAccounts";
import { AccountStatus, Role } from "../../../types/enum";
import { formatTime, removeTime } from "../../../utils/dateTimeFunction";
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
    const [modalOpenActive, { open: openActive, close: closeActive }] = useDisclosure(false);

    const { data, isLoading, error, refetch } = useGetAccountById(params.accountId!);
    const { mutate: deleteAccount, isLoading: isLoadingDelete } = useDeleteAccount();
    const { mutate: activateAccount, isLoading: isLoadingActivate } = useActivateAccount();

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onDelete = () => {
        deleteAccount(params.accountId!, {
            onSuccess() {
                navigate('/account')
                notifications.show({
                    title: "Successfully",
                    message: "Account Delete successful",
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
                        message: "Something wrong happen when trying to delete this account",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                close();
            },
        });
    }

    const onActivate = () => {
        activateAccount(params.accountId!, {
            onSuccess() {
                notifications.show({
                    title: "Successfully",
                    message: "Account Delete successful",
                    color: "green",
                    withCloseButton: true,
                });
                refetch();
                closeActive();
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
                        message: "Something wrong happen when trying to delete this account",
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
                        {/* Account section */}
                        {error ? <Text fs="italic" ta="center">Account not found</Text> :
                            <div className={styled["profile-header"]}>
                                <div>
                                    <Group mb={15} gap={30}>
                                        <div>
                                            <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{data?.name}</Text>
                                            {data?.role && <Text fw="bold">{data.role.replace(/([A-Z])/g, ' $1').trim()}</Text>}
                                        </div>
                                        <StatusBadge statusName={data?.accountStatus ? data.accountStatus : "None"}
                                            mb={15} mt={15} />
                                    </Group>
                                    {data?.gender &&
                                        <Group>
                                            {data?.gender == "Female" ?
                                                <IconGenderFemale size={20} /> :
                                                <IconGenderMale size={20} />
                                            }
                                            <Text>{data?.gender}</Text>
                                        </Group>
                                    }
                                    {data?.email &&
                                        <Group>
                                            <IconMail size={20} />
                                            <Text>{data?.email}</Text>
                                        </Group>
                                    }
                                    {data?.phone &&
                                        <Group>
                                            <IconPhone size={20} />
                                            <Text>{data?.phone}</Text>
                                        </Group>
                                    }
                                    {data?.birthday &&
                                        <Group>
                                            <IconCake size={20} />
                                            <Text>{removeTime(new Date(data?.birthday), "/", "dd/MM/yyyy")}</Text>
                                        </Group>
                                    }
                                    {(data?.ward || data?.addressLine) &&
                                        <Group>
                                            <IconHome size={20} />
                                            {(data?.ward && data?.addressLine) && <Text>{data.addressLine}, {data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                            {(data?.ward && !data?.addressLine) && <Text>{data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                            {(!data?.ward && data?.addressLine) && <Text>{data.addressLine}</Text>}
                                        </Group>
                                    }
                                    {data?.createdDate &&
                                        <Group mb={20}>
                                            <IconClock size={20} />
                                            <Text>Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                        </Group>
                                    }
                                </div>
                                {data?.role == Role.BrandManager &&
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
                                                <Menu.Item leftSection={<IconEdit size={20} />}
                                                    onClick={() => navigate(`/account/${params?.accountId!}/update`)}>
                                                    Update
                                                </Menu.Item>
                                                {data?.accountStatus !== AccountStatus.Inactive &&
                                                    <Menu.Item color="red" leftSection={<IconTrash style={{ color: "red" }} size={20} />}
                                                        onClick={open} >
                                                        Delete
                                                    </Menu.Item>
                                                }
                                                {data?.accountStatus == AccountStatus.Inactive &&
                                                    <Menu.Item color="green" leftSection={<IconRepeat style={{ color: "green" }} size={20} />}
                                                        onClick={openActive} >
                                                        Reactivate
                                                    </Menu.Item>
                                                }
                                            </Menu.Dropdown>
                                        </Menu>
                                    </div>
                                }
                                {data?.role == Role.ShopManager && data?.accountStatus !== AccountStatus.Inactive &&
                                    <Button
                                        variant="gradient" size="sm"
                                        onClick={open} loading={isLoading}
                                        gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                                    >
                                        Delete
                                    </Button>
                                }
                                {data?.role == Role.ShopManager && data?.accountStatus == AccountStatus.Inactive &&
                                    <Button
                                        variant="gradient" size="sm"
                                        onClick={openActive} loading={isLoading}
                                        gradient={{ from: "green.5", to: "green.7", deg: 90 }}
                                    >
                                        Reactivate
                                    </Button>
                                }
                            </div>
                        }

                        {/* Brand section */}
                        {data?.role == Role.BrandManager && data?.brand &&
                            <>
                                {!isLoading ?
                                    <>
                                        <Divider />
                                        <Box my={10}>
                                            <Group mt={10} justify="space-between">
                                                <Text fz={16} fw={'bold'} c={"grey"}>Brand</Text>
                                                <Button variant="filled" size="sm" color="light-blue.6"
                                                    onClick={() => navigate(`/brand/${data?.brand?.id}`, {
                                                        state: { tab: "managers", }
                                                    })}>
                                                    View Brand
                                                </Button>
                                            </Group>
                                            <div className={styled["shop-brand-detail"]}>
                                                <Group mt={20} align="flex-start">
                                                    <Avatar w={150} h={150} mr={20} src={data?.brand?.logo?.hostingUri} />
                                                    <div>
                                                        <Group mb={5}>
                                                            <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.brand?.name}</Text>
                                                            <StatusBadge statusName={data?.brand?.brandStatus ? data?.brand?.brandStatus : "None"} padding={10} size="sm" />
                                                        </Group>
                                                        {data?.brand?.email &&
                                                            <Group mb={5}>
                                                                <IconMail size={20} />
                                                                <Text>{data?.brand?.email}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.phone &&
                                                            <Group mb={5}>
                                                                <IconPhone size={20} />
                                                                <Text>{data?.brand?.phone}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.createdDate &&
                                                            <Group mb={20}>
                                                                <IconClock size={20} />
                                                                <Text>Created on: {data?.brand?.createdDate && removeTime(new Date(data?.brand?.createdDate), "/")}</Text>
                                                            </Group>
                                                        }
                                                    </div>
                                                </Group>
                                            </div>
                                        </Box>
                                    </>
                                    :
                                    <Box className={styled["loader"]}>
                                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                    </Box>
                                }
                            </>
                        }

                        {/* Brand Manager Shop List section */}
                        {
                            data?.role == Role.BrandManager && data?.brand &&
                            <>
                                <Divider />
                                <Box my={10}>
                                    <div className={styled["shop-detail"]}>
                                        <Text fz={16} fw={'bold'} c={"grey"}>Shops</Text>
                                        <ShopShortListById id={data?.brand.id} idType="brand" />
                                    </div>
                                </Box>
                            </>
                        }

                        {/* Shop Manager Shop section */}
                        {
                            data?.role == Role.ShopManager && data?.managingShop &&
                            <>
                                {!isLoading ?
                                    <>
                                        <Divider />
                                        <Box my={10}>
                                            <Group mt={10} justify="space-between">
                                                <Text fz={16} fw={'bold'} c={"grey"}>Shop</Text>
                                                <Button variant="filled" size="sm" color="light-blue.6"
                                                    onClick={() => navigate(`/shop/${data?.managingShop?.id}`, {
                                                        state: { tab: "employees", }
                                                    })}>
                                                    View Shop
                                                </Button>
                                            </Group>
                                            <div className={styled["shop-brand-detail"]}>
                                                <div>
                                                    <Group mb={20}>
                                                        <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.managingShop?.name}</Text>
                                                        <StatusBadge statusName={data?.managingShop?.shopStatus ? data?.managingShop?.shopStatus : "None"}
                                                        />
                                                    </Group>
                                                    <Group>
                                                        <MdOutlineAccessTime size={20} />
                                                        <Text>
                                                            <b>Open:</b> {data?.managingShop?.openTime ? formatTime(data?.managingShop?.openTime, false, false) : "No Data"} - <b>Close:</b> {data?.managingShop?.closeTime ? formatTime(data?.managingShop?.closeTime, false, false) : "No Data"}
                                                        </Text>
                                                    </Group>
                                                    {data?.brand?.phone &&
                                                        <Group>
                                                            <MdPhone size={20} />
                                                            <Text>{data?.brand?.phone}</Text>
                                                        </Group>
                                                    }
                                                    {(data?.managingShop?.ward || data?.managingShop?.addressLine) &&
                                                        <Group>
                                                            <MdHome size={20} />
                                                            {(data?.managingShop?.ward && data?.managingShop?.addressLine) && <Text>{data?.managingShop.addressLine}, {data?.managingShop.ward?.name}, {data?.managingShop.ward?.district?.name}, {data?.managingShop.ward?.district?.province?.name}</Text>}
                                                            {(data?.managingShop?.ward && !data?.managingShop?.addressLine) && <Text>{data?.managingShop.ward?.name}, {data?.managingShop.ward?.district?.name}, {data?.managingShop.ward?.district?.province?.name}</Text>}
                                                            {(!data?.managingShop?.ward && data?.managingShop?.addressLine) && <Text>{data?.managingShop.addressLine}</Text>}
                                                        </Group>
                                                    }
                                                    {data?.brand?.createdDate &&
                                                        <Group mb={20}>
                                                            <MdAccessTime size={20} />
                                                            <Text>Created on: {data?.brand?.createdDate && removeTime(new Date(data?.brand?.createdDate), "/")}</Text>
                                                        </Group>
                                                    }
                                                </div>
                                            </div>
                                        </Box>
                                    </>
                                    :
                                    <Box className={styled["loader"]}>
                                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                    </Box>
                                }
                            </>
                        }
                    </div>
                }

            </div >
            <CustomModal cancelLabel="Cancel" onClickAction={onDelete} onClose={close} opened={modalOpen} label="Delete" topTitle="Delete Account"
                title="Do you want to remove this account?" centered loading={isLoadingDelete} />

            <CustomModal cancelLabel="Cancel" onClickAction={onActivate} onClose={closeActive} opened={modalOpenActive} label="Reactivate" topTitle="Reactivate Account"
                title="Do you want to reactivate this account?" centered loading={isLoadingActivate} color="green"/>
        </>
    );
};

export default AccountDetail;
