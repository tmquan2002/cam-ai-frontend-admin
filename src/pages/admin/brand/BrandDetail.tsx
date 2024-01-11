import { ActionIcon, Badge, Divider, Group, Image, Loader, Text, Tooltip } from "@mantine/core";
import { MdDelete, MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { SideBar } from "../../../components/sidebar/SideBar";
import { NO_IMAGE_LOGO } from "../../../constants/ImagePlaceholders";
import { useGetBrandById } from "../../../hooks/useBrands";
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

    const params = useParams();
    // console.log(params);

    const {
        data,
        isLoading
    } = useGetBrandById(params.brandId!);

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <div className={styled["container-right"]}>
                <Navbar items={breadcrumbs} goBackLink="/brand" />
                {isLoading ? <Loader type="bar" /> :
                    <div className={styled["container-detail"]}>
                        {data?.bannerUri && <Image h={150} mb={20} src={data?.logoUri} />}
                        {/* <Image h={150} mb={20} src={data?.logoUri} /> */}
                        <div className={styled["profile-header"]}>
                            <div className={styled["profile-header-left"]}>
                                <Image w={150} h={150} src={data?.logoUri ? data?.logoUri : NO_IMAGE_LOGO} />
                                <div>
                                    <Text size="lg" style={{fontWeight: 'bold'}}>{data?.name}</Text>
                                    <Text size="sm">Email: {data?.email}</Text>
                                    <Text size="xs" mb={20}>Created on: {data?.createdDate && removeTime(new Date(data?.createdDate))}</Text>
                                    <Badge size='lg' radius={"lg"} color="light-yellow.7">
                                        {data?.brandStatus ? data.brandStatus.name : "No Status"}
                                    </Badge>
                                </div>
                            </div>
                            <Group>
                                <Tooltip label="Update" withArrow>
                                    <ActionIcon
                                        variant="filled" size="xl" aria-label="Logout" color={"light-yellow.9"}
                                    >
                                        <MdEdit style={{ width: 18, height: 18 }} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete" withArrow>
                                    <ActionIcon
                                        variant="filled" size="xl" aria-label="Logout" color={"pale-red.9"}
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
        </div>
    );
};

export default BrandDetail;
