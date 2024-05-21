import { ActionIcon, Avatar, Box, Button, Divider, Group, LoadingOverlay, Menu, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import axios from "axios";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { MdAccessTime, MdCalendarToday, MdDelete, MdEdit, MdEmail, MdHome, MdOutlineAccessTime, MdPhone } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { ShopShortListById } from "../../../components/list/ShopShortListById";
import { CustomModal } from "../../../components/modal/CustomSimleModel";
import Navbar from "../../../components/navbar/Navbar";
import { useDeleteAccount, useGetAccountById } from "../../../hooks/useAccounts";
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

    const { data, isLoading, error } = useGetAccountById(params.accountId!);
    const { mutate: deleteAccount, isLoading: isLoadingDelete } = useDeleteAccount();

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onDelete = () => {
        deleteAccount(params.accountId!, {
            onSuccess() {
                navigate('/account')
                notifications.show({
                    title: "Successfully",
                    message: "This account is now Inactive",
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
                                            {data?.role && <Text size="md" fw="bold">{data.role.replace(/([A-Z])/g, ' $1').trim()}</Text>}
                                        </div>
                                        <StatusBadge statusName={data?.accountStatus ? data.accountStatus : "None"}
                                            mb={15} mt={15} />
                                    </Group>
                                    {data?.gender &&
                                        <Group>
                                            {data?.gender == "Female" ?
                                                <BsGenderFemale /> :
                                                <BsGenderMale />
                                            }
                                            <Text size="md">{data?.gender}</Text>
                                        </Group>
                                    }
                                    {data?.email &&
                                        <Group>
                                            <MdEmail />
                                            <Text size="md">{data?.email}</Text>
                                        </Group>
                                    }
                                    {data?.phone &&
                                        <Group>
                                            <MdPhone />
                                            <Text size="md">{data?.phone}</Text>
                                        </Group>
                                    }
                                    {data?.birthday &&
                                        <Group>
                                            <MdCalendarToday />
                                            <Text size="md">{removeTime(new Date(data?.birthday), "/", "dd/MM/yyyy")}</Text>
                                        </Group>
                                    }
                                    {(data?.ward || data?.addressLine) &&
                                        <Group>
                                            <MdHome />
                                            {(data?.ward && data?.addressLine) && <Text size="md">{data.addressLine}, {data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                            {(data?.ward && !data?.addressLine) && <Text size="md">{data.ward?.name}, {data.ward?.district?.name}, {data.ward?.district?.province?.name}</Text>}
                                            {(!data?.ward && data?.addressLine) && <Text size="md">{data.addressLine}</Text>}
                                        </Group>
                                    }
                                    {data?.createdDate &&
                                        <Group mb={20}>
                                            <MdAccessTime />
                                            <Text size="md">Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
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
                                                <Menu.Item leftSection={<MdEdit />}
                                                    onClick={() => navigate(`/account/${params?.accountId!}/update`)}>
                                                    Update
                                                </Menu.Item>

                                                <Menu.Item color="red" leftSection={<MdDelete style={{ color: data?.accountStatus == AccountStatus.Inactive ? "grey" : "red" }} />}
                                                    disabled={data?.accountStatus == AccountStatus.Inactive}
                                                    onClick={open} >
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </div>
                                }
                                {data?.role == Role.ShopManager &&
                                    <Button
                                        variant="gradient" size="sm"
                                        onClick={open} loading={isLoading}
                                        gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                                    >
                                        Delete
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
                                                <Group mt={20}>
                                                    <Avatar w={150} h={150} mr={20} src={data?.brand?.logo?.hostingUri} />
                                                    <div>
                                                        <Group>
                                                            <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.brand?.name}</Text>
                                                            <StatusBadge statusName={data?.brand?.brandStatus ? data?.brand?.brandStatus : "None"}
                                                            />
                                                        </Group>
                                                        {data?.brand?.email &&
                                                            <Group>
                                                                <MdEmail />
                                                                <Text size="md">{data?.brand?.email}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.phone &&
                                                            <Group>
                                                                <MdPhone />
                                                                <Text size="md">{data?.brand?.phone}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.createdDate &&
                                                            <Group mb={20}>
                                                                <MdAccessTime />
                                                                <Text size="md">Created on: {data?.brand?.createdDate && removeTime(new Date(data?.brand?.createdDate), "/")}</Text>
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
                                                        <MdOutlineAccessTime />
                                                        <Text size="md">
                                                            <b>Open:</b> {data?.managingShop?.openTime ? formatTime(data?.managingShop?.openTime, false, false) : "No Data"} - <b>Close:</b> {data?.managingShop?.closeTime ? formatTime(data?.managingShop?.closeTime, false, false) : "No Data"}
                                                        </Text>
                                                    </Group>
                                                    {data?.brand?.phone &&
                                                        <Group>
                                                            <MdPhone />
                                                            <Text size="md">{data?.brand?.phone}</Text>
                                                        </Group>
                                                    }
                                                    {(data?.managingShop?.ward || data?.managingShop?.addressLine) &&
                                                        <Group>
                                                            <MdHome />
                                                            {(data?.managingShop?.ward && data?.managingShop?.addressLine) && <Text size="md">{data?.managingShop.addressLine}, {data?.managingShop.ward?.name}, {data?.managingShop.ward?.district?.name}, {data?.managingShop.ward?.district?.province?.name}</Text>}
                                                            {(data?.managingShop?.ward && !data?.managingShop?.addressLine) && <Text size="md">{data?.managingShop.ward?.name}, {data?.managingShop.ward?.district?.name}, {data?.managingShop.ward?.district?.province?.name}</Text>}
                                                            {(!data?.managingShop?.ward && data?.managingShop?.addressLine) && <Text size="md">{data?.managingShop.addressLine}</Text>}
                                                        </Group>
                                                    }
                                                    {data?.brand?.createdDate &&
                                                        <Group mb={20}>
                                                            <MdAccessTime />
                                                            <Text size="md">Created on: {data?.brand?.createdDate && removeTime(new Date(data?.brand?.createdDate), "/")}</Text>
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
        </>
    );
};

export default AccountDetail;
