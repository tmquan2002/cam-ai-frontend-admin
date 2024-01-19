import { ActionIcon, Badge, Button, Divider, Group, Image, Loader, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { NO_IMAGE_LOGO } from "../../../constants/ImagePlaceholders";
import { useDeleteBrand, useGetBrandById } from "../../../hooks/useBrands";
import { removeTime } from "../../../utils/dateFormat";
import styled from "./styles/branddetail.module.scss";
import { notifications } from "@mantine/notifications";
import axios from "axios";

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
    // console.log(params);
    const [modalOpen, { open, close }] = useDisclosure(false);

    const {
        data,
        isLoading
    } = useGetBrandById(params.brandId!);

    const { mutate: deleteBrand } = useDeleteBrand();

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
                } else {
                    console.error(error);
                    notifications.show({
                        message: "Something wrong happen when trying to remove the brand",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                    close();
                }
            },
        });
    }

    return (
        <>
            <div className={styled["container-right"]}>
                <Navbar items={breadcrumbs} goBack />
                {isLoading ? <Loader type="bar" /> :
                    <div className={styled["container-detail"]}>
                        {data?.bannerUri && <Image h={150} mb={20} src={data?.bannerUri} />}
                        {/* <Image h={150} mb={20} src={data?.logoUri} /> */}
                        <div className={styled["profile-header"]}>
                            <div className={styled["profile-header-left"]}>
                                <Image w={150} h={150} mr={20} src={data?.logoUri ? data?.logoUri : NO_IMAGE_LOGO} />
                                <div>
                                    <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.name}</Text>
                                    <Text size="sm">Email: {data?.email}</Text>
                                    <Text size="xs" mb={20}>Created on: {data?.createdDate && removeTime(new Date(data?.createdDate), "/")}</Text>
                                    <Badge size='lg' radius={"lg"} color="light-yellow.7">
                                        {data?.brandStatus ? data.brandStatus.name : "None"}
                                    </Badge>
                                </div>
                            </div>
                            <Group>
                                <Tooltip label="Update" withArrow>
                                    <ActionIcon
                                        variant="filled" size="xl" aria-label="Logout" color={"light-yellow.9"}
                                        onClick={() => navigate(`/brand/${params.brandId!}/update`)}
                                    >
                                        <MdEdit style={{ width: 18, height: 18 }} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                        variant="filled" size="xl" aria-label="Logout" color={"pale-red.9"}
                                        onClick={open}
                                    >
                                        <MdDelete style={{ width: 18, height: 18 }} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </div>
                        <Divider my="md" />
                        {/* TODO: Add mỏe detail for the account */}
                        <div className={styled["profile-detail"]}>
                            <Text>{data?.phone}</Text>
                        </div>
                    </div>
                }
            </div>
            <Modal opened={modalOpen} onClose={close} title="Delete this brand?" centered>
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

export default BrandDetail;
