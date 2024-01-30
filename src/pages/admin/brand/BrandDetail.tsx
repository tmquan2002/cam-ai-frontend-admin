import { ActionIcon, Avatar, Badge, Box, Button, Divider, Group, Image, LoadingOverlay, Menu, Modal, Tabs, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import axios from "axios";
import { AiFillControl, AiFillShop } from "react-icons/ai";
import { MdAccessTime, MdAutorenew, MdDelete, MdEdit, MdEmail, MdOutlineSupervisorAccount, MdPhone } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { AccountListById } from "../../../components/list/AccountListById";
import { ShopListById } from "../../../components/list/ShopListById";
import Navbar from "../../../components/navbar/Navbar";
import { NO_IMAGE_LOGO } from "../../../constants/ImagePlaceholders";
import { useDeleteBrand, useGetBrandById, useReactivateBrand } from "../../../hooks/useBrands";
import { BrandStatus, StatusColor } from "../../../types/enum";
import { removeTime } from "../../../utils/dateFormat";
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

    //TODO: Add Details of Shops, Accounts (Employees and Brand/Shop Manager) and Edge Box
    const params = useParams();
    const navigate = useNavigate();
    // console.log(params);
    const [modalOpen, { open, close }] = useDisclosure(false);

    const { data, isLoading } = useGetBrandById(params.brandId!);

    const { mutate: deleteBrand } = useDeleteBrand();
    const { mutate: reactivateBrand } = useReactivateBrand();

    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const onDelete = () => {
        deleteBrand(params.brandId!, {
            onSuccess() {
                navigate('/brand')
                notifications.show({
                    message: "Brand disabled!",
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
                    message: "Brand Reactivated!",
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
                        {data?.bannerUri && <Image h={200} mb={20} src={data?.bannerUri} />}
                        <div className={styled["profile-header"]}>
                            <div className={styled["profile-header-left"]}>
                                <Avatar w={150} h={150} mr={20} src={data?.logoUri ? data?.logoUri : NO_IMAGE_LOGO} />
                                <div>
                                    <Group>
                                        <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                        <Badge size='lg' radius={"lg"} autoContrast p={17}
                                            color={data?.brandStatus?.id == BrandStatus.Active ? StatusColor.ACTIVE :
                                                data?.brandStatus?.id == BrandStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                                        >
                                            {data?.brandStatus ? data.brandStatus.name : "None"}
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
                                            onClick={() => navigate(`/brand/${params.brandId!}/update`)}>
                                            Update
                                        </Menu.Item>
                                        {data?.brandStatus?.id === BrandStatus.Active ?
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
                        <Divider my="md" />
                        <div className={styled["profile-detail"]}>
                            <Tabs defaultValue="shops">
                                <Tabs.List>
                                    <Tabs.Tab value="shops" leftSection={<AiFillShop />}>
                                        Shops
                                    </Tabs.Tab>
                                    <Tabs.Tab value="accounts" leftSection={<MdOutlineSupervisorAccount />}>
                                        Accounts
                                    </Tabs.Tab>
                                    <Tabs.Tab value="edge boxes" leftSection={<AiFillControl />}>
                                        Edge Boxes
                                    </Tabs.Tab>
                                </Tabs.List>

                                <Tabs.Panel value="shops">
                                    <ShopListById id={params.brandId!} idType="brand" />
                                </Tabs.Panel>

                                <Tabs.Panel value="accounts">
                                    <AccountListById id={params.brandId!} />
                                </Tabs.Panel>

                                {/* TODO: Edge Box list */}
                                <Tabs.Panel value="edge boxes">
                                    Edge Box tab content coming soon
                                </Tabs.Panel>
                            </Tabs>
                        </div>
                    </div>
                }
            </div>
            {/* Delete Modal */}
            <Modal opened={modalOpen} onClose={close}
                title={data?.brandStatus?.id === BrandStatus.Active ? "Delete this brand?" : "Reactivate this brand?"} centered>
                {data?.brandStatus?.id === BrandStatus.Active ?
                    <Text>
                        Do you want to remove this brand? This action will switch a brand status to <b>INACTIVE</b>
                    </Text>
                    :
                    <Text>
                        Do you want to reactivate this brand? This action will switch a brand status to <b>ACTIVE</b>
                    </Text>
                }
                <Group align="end">
                    <Button
                        variant="outline" size="md" mt={20} onClick={close}
                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                    >
                        CANCEL
                    </Button>
                    {data?.brandStatus?.id === BrandStatus.Active ?
                        <Button
                            variant="gradient" size="md" mt={20} onClick={onDelete}
                            gradient={{ from: "pale-red.5", to: "pale-red.7", deg: 90 }}
                        >
                            DELETE
                        </Button> :
                        <Button
                            variant="gradient" size="md" mt={20} onClick={onReactivate}
                            gradient={{ from: "green.5", to: "green.7", deg: 90 }}
                        >
                            REACTIVATE
                        </Button>
                    }
                </Group>
            </Modal>
        </>
    );
};

export default BrandDetail;
