import { ActionIcon, Avatar, Box, Button, Divider, Group, Image, Loader, LoadingOverlay, Menu, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots, IconNetwork, IconRouter } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { AiFillShop } from "react-icons/ai";
import { MdAccessTime, MdAccountCircle, MdAutorenew, MdDelete, MdEdit, MdEmail, MdHome, MdOutlineSupervisorAccount, MdPhone } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { AccountListById } from "../../../components/list/AccountListById";
import { EdgeBoxListByBrandId } from "../../../components/list/EdgeBoxListByBrandId";
import { EmployeeListById } from "../../../components/list/EmployeeListById";
import { ShopShortListById } from "../../../components/list/ShopShortListById";
import { CustomModal } from "../../../components/modal/CustomSimleModel";
import Navbar from "../../../components/navbar/Navbar";
import { useGetAccountById } from "../../../hooks/useAccounts";
import { useDeleteBrand, useGetBrandById, useReactivateBrand } from "../../../hooks/useBrands";
import { BrandStatus } from "../../../types/enum";
import { removeTime } from "../../../utils/dateTimeFunction";
import styled from "./styles/branddetail.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Brand",
        link: "/brand"
    },
    {
        title: "Detail"
    }
]

const BrandDetail = () => {

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // console.log(params);
    const [modalOpen, { open, close }] = useDisclosure(false);
    const [activeTab, setActiveTab] = useState<string | null>(location?.state?.tab ?? 'shops')

    const { data, isLoading, error } = useGetBrandById(params.brandId!);
    const { data: dataManager, isLoading: isLoadingManager } = useGetAccountById(data?.brandManagerId);

    const { mutate: deleteBrand, isLoading: isLoadingDelete } = useDeleteBrand();
    const { mutate: reactivateBrand, isLoading: isLoadingReactivate } = useReactivateBrand();

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onDelete = () => {
        deleteBrand(params.brandId!, {
            onSuccess() {
                navigate('/brand')
                notifications.show({
                    title: "Successfully",
                    message: "Brand disabled!",
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
                        message: "Something wrong happen when trying to remove this brand",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                close();
            },
        });
    }

    const onReactivate = () => {
        reactivateBrand(params.brandId!, {
            onSuccess() {
                navigate('/brand')
                notifications.show({
                    title: "Successfully",
                    message: "Brand Reactivated!",
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
                        message: "Something wrong happen when trying to reactivate this brand",
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
                        {error ? <Text fs="italic" ta="center">Brand not found</Text> :
                            <>
                                {data?.banner && <Image h={220} mb={20} radius={5} src={data?.banner?.hostingUri} />}
                                <div className={styled["profile-header"]}>
                                    <div className={styled["profile-header-left"]}>
                                        <Avatar w={150} h={150} mr={20} src={data?.logo?.hostingUri} />
                                        <div>
                                            <Group mb={15}>
                                                <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{data?.name}</Text>
                                                <StatusBadge statusName={data?.brandStatus ? data.brandStatus : "None"} />
                                            </Group>

                                            {isLoadingManager ? <Loader size="sm" /> :
                                                dataManager?.id ?
                                                    <Group>
                                                        <MdAccountCircle size={20} />
                                                        Brand Manager: <Link to={`/account/${dataManager.id}`} style={{ textDecoration: 'none' }}>
                                                            <Text size="md">{dataManager.name}</Text>
                                                        </Link>
                                                    </Group>
                                                    :
                                                    <Button
                                                        onClick={() => navigate("/account/add", { state: { brandId: params.brandId!, name: data?.name } })} variant="gradient"
                                                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }} mb={10} size="sm"
                                                    >
                                                        Add Manager
                                                    </Button>
                                            }
                                            {data?.email &&
                                                <Group>
                                                    <MdEmail size={20} />
                                                    <Text size="md">{data?.email}</Text>
                                                </Group>
                                            }
                                            {data?.brandWebsite &&
                                                <Group>
                                                    <IconNetwork size={20} />
                                                    <a href={data?.brandWebsite} style={{ textDecoration: "none" }} target="_blank">
                                                        <Text size="md">
                                                            {data?.brandWebsite}
                                                        </Text>
                                                    </a>
                                                </Group>
                                            }
                                            {data?.phone &&
                                                <Group>
                                                    <MdPhone size={20} />
                                                    <Text size="md">{data?.phone}</Text>
                                                </Group>
                                            }
                                            {data?.createdDate &&
                                                <Group mb={20}>
                                                    <MdAccessTime size={20} />
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
                                                    onClick={() => navigate(`/brand/${params.brandId!}/update`)}>
                                                    Update
                                                </Menu.Item>
                                                {data?.brandStatus == BrandStatus.Active ?
                                                    <Menu.Item color="red" leftSection={<MdDelete style={{ color: "red" }} />}
                                                        onClick={open} >
                                                        Delete
                                                    </Menu.Item>
                                                    :
                                                    <Menu.Item leftSection={<MdAutorenew />}
                                                        onClick={open} >
                                                        Reactivate
                                                    </Menu.Item>
                                                }
                                            </Menu.Dropdown>
                                        </Menu>
                                    </div>
                                </div>
                                {data?.description &&
                                    <Box>
                                        <Text size="sm" fw="bold">Description</Text>
                                        <Text size="md">{data?.description}</Text>
                                    </Box>
                                }
                                <Divider my="md" />
                                <Box>
                                    <Text size='md' fw={'bold'} fz={20} c={"light-blue.4"}>Company</Text>
                                    <Text size='md' fw={'bold'} fz={17} mt={10}>{data?.companyName}</Text>
                                    <Group>
                                        <MdHome />
                                        {(data?.companyWard && data?.companyAddress) && <Text size="md">{data.companyAddress}, {data.companyWard?.name}, {data.companyWard?.district?.name}, {data.companyWard?.district?.province?.name}</Text>}
                                        {(data?.companyWard && !data?.companyAddress) && <Text size="md">{data.companyWard?.name}, {data.companyWard?.district?.name}, {data.companyWard?.district?.province?.name}</Text>}
                                        {(!data?.companyWard && data?.companyAddress) && <Text size="md">{data.companyAddress}</Text>}
                                        {(!data?.companyWard && !data?.companyAddress) && <Text size="md">No Data</Text>}
                                    </Group>
                                </Box>
                                <Divider my="md" />
                                <div className={styled["profile-detail"]}>
                                    <Tabs value={activeTab} onChange={setActiveTab}>
                                        <Tabs.List>
                                            <Tabs.Tab value="shops" leftSection={<AiFillShop />}>
                                                Shops
                                            </Tabs.Tab>
                                            <Tabs.Tab value="managers" leftSection={<MdOutlineSupervisorAccount />}>
                                                Managers
                                            </Tabs.Tab>
                                            <Tabs.Tab value="employees" leftSection={<MdAccountCircle />}>
                                                Employees
                                            </Tabs.Tab>
                                            <Tabs.Tab value="edge boxes" leftSection={<IconRouter />}>
                                                Edge Boxes
                                            </Tabs.Tab>
                                        </Tabs.List>

                                        <Tabs.Panel value="shops">
                                            <ShopShortListById id={params.brandId!} idType="brand" />
                                        </Tabs.Panel>

                                        <Tabs.Panel value="managers">
                                            <AccountListById id={params.brandId!} type="manager" />
                                        </Tabs.Panel>

                                        <Tabs.Panel value="employees">
                                            <EmployeeListById id={params.brandId!} type="brand" />
                                        </Tabs.Panel>

                                        <Tabs.Panel value="edge boxes">
                                            <EdgeBoxListByBrandId brandId={params.brandId!} />
                                        </Tabs.Panel>
                                    </Tabs>
                                </div>
                            </>
                        }
                    </div>
                }
            </div>
            {/* Delete Modal */}
            {data?.brandStatus === BrandStatus.Active ?
                <CustomModal cancelLabel="Cancel" onClickAction={onDelete} onClose={close} opened={modalOpen} label="Delete" topTitle="Delete Brand"
                    title="Do you want to remove this brand?" centered loading={isLoadingDelete} />
                :
                <CustomModal cancelLabel="Cancel" onClickAction={onReactivate} onClose={close} opened={modalOpen} label="Reactivate" topTitle="Reactivate Brand"
                    title="Do you want to reactivate this brand?" centered loading={isLoadingReactivate} blueModal />
            }
        </>
    );
};

export default BrandDetail;
