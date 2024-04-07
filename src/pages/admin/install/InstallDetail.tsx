import { Divider, Tabs, Text } from "@mantine/core";
import { AiFillControl, AiFillShop } from "react-icons/ai";
import { TbActivity } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import styled from "./styles/edgeboxinstalldetail.module.scss";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Install",
        link: "/install"
    },
    {
        title: "Detail"
    }
]

//TODO: Add activity log of an edge box
const InstallDetail = () => {

    //TODO: Make UI without any API first, use shop detail as reference
    const params = useParams();
    const navigate = useNavigate();

    // const { isFetching, data, refetch, error } = useGetEdgeBoxInstallByEdgeBoxId(params.edgeBoxId!);

    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBack />
            {/* <Box className={styled["loader"]}>
                     <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                 </Box> : */}
            <div className={styled["container-detail"]}>
                {/* <Text fs="italic" ta="center">No installation found</Text> : */}
                <>
                    <div className={styled["profile-header"]}>
                        <div className={styled["profile-header-left"]}>
                            <div>
                                {/* TODO: Install infos here */}
                            </div>
                        </div>
                    </div>
                    <Divider my="md" />
                    <div className={styled["profile-detail"]}>
                        <Tabs defaultValue="shop">
                            <Tabs.List>
                                <Tabs.Tab value="shop" leftSection={<AiFillShop />}>
                                    Shop
                                </Tabs.Tab>
                                <Tabs.Tab value="edge box" leftSection={<AiFillControl />}>
                                    Edge Box
                                </Tabs.Tab>
                                <Tabs.Tab value="activities" leftSection={<TbActivity />}>
                                    Activities
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="shop">
                                <Text>Nothing here yet</Text>
                            </Tabs.Panel>

                            <Tabs.Panel value="edge box">
                                <Text>Nothing here yet</Text>
                            </Tabs.Panel>

                            <Tabs.Panel value="activities">
                                <Text>Nothing here yet</Text>
                            </Tabs.Panel>
                        </Tabs>
                    </div>
                </>
            </div>
        </div >
    );
};

export default InstallDetail;
