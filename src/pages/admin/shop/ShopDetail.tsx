import { Avatar, Box, Button, Divider, Group, Loader, LoadingOverlay, Modal, Tabs, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconClock, IconHome, IconMail, IconNotes, IconPhone, IconRouter, IconUserCircle } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../../components/badge/StatusBadge";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import { EdgeBoxInstallListByShopId } from "../../../components/list/EdgeBoxInstallListByShopId";
import { EmployeeListById } from "../../../components/list/EmployeeListById";
import Navbar from "../../../components/navbar/Navbar";
import { useGetInstallByShopId } from "../../../hooks/useEdgeBoxInstalls";
import { useGetShopById } from "../../../hooks/useShops";
import { EdgeBoxInstallStatus, ShopStatus } from "../../../types/enum";
import { formatTime, removeTime } from "../../../utils/dateTimeFunction";
import { ShopEdgeBoxAssignForm } from "./components/ShopEdgeBoxAssignForm";
import styled from "./styles/shopdetail.module.scss";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Shop",
        link: "/shop"
    },
    {
        title: "Detail"
    }
]

const ShopDetail = () => {

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [modalAssignOpen, { open: openAssign, close: closeAssign }] = useDisclosure(false);
    const { data, isFetching, error, refetch } = useGetShopById(params.shopId!);
    const { isLoading: isLoadingInstall, data: dataInstall, error: installError, refetch: refetchInstall } = useGetInstallByShopId(params.shopId!);
    const [activeTab, setActiveTab] = useState<string | null>(location?.state?.tab ?? 'brand')

    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBack />
            {isFetching ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["container-detail"]}>
                    {error ? <Text fs="italic" ta="center">Shop not found</Text> :
                        <>
                            <div className={styled["profile-header"]}>
                                <div className={styled["profile-header-left"]}>
                                    <div>
                                        <Group mb={15}>
                                            <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{data?.name}</Text>
                                            <StatusBadge statusName={data?.shopStatus ? data.shopStatus : "None"} />
                                        </Group>
                                        <Group>
                                            <IconUserCircle size={20} />
                                            Shop Manager:
                                            {data?.shopManager ?
                                                <Link to={`/account/${data?.shopManager.id}`} style={{ textDecoration: 'none' }}>
                                                    <Text>{data?.shopManager.name}</Text>
                                                </Link>
                                                :
                                                <Text>None</Text>
                                            }
                                        </Group>
                                        <Group>
                                            <IconClock size={20} />
                                            <Text><b>Open:</b> {data?.openTime ? formatTime(data?.openTime, false, false) : "No Data"} - <b>Close:</b> {data?.closeTime ? formatTime(data?.closeTime, false, false) : "No Data"} </Text>
                                        </Group>
                                        {data?.phone &&
                                            <Group>
                                                <IconPhone size={20} />
                                                <Text>{data?.phone}</Text>
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
                                    </div>
                                </div>
                                {data?.shopStatus == ShopStatus.Active && dataInstall?.values.filter(e => e.edgeBoxInstallStatus !== EdgeBoxInstallStatus.Disabled).length == 0 &&
                                    <Button
                                        onClick={openAssign} variant="gradient"
                                        gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }} mb={10} size="sm"
                                    >
                                        Assign Edge Box
                                    </Button>
                                }
                            </div>
                            <Divider my="md" />
                            <div className={styled["profile-detail"]}>
                                <Tabs value={activeTab} onChange={setActiveTab}>
                                    <Tabs.List>
                                        <Tabs.Tab value="brand" leftSection={<IconNotes size={20} />}>
                                            Brand
                                        </Tabs.Tab>
                                        <Tabs.Tab value="employees" leftSection={<IconUserCircle size={20} />}>
                                            Employees
                                        </Tabs.Tab>
                                        <Tabs.Tab value="edge boxes" leftSection={<IconRouter size={20} />}>
                                            Edge Boxes
                                        </Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="brand">
                                        {isFetching ?
                                            <Box className={styled["loader-tab"]}>
                                                <Loader />
                                            </Box>
                                            :
                                            <div className={styled["tab-detail"]}>
                                                <Group className={styled["brand-profile"]} mt={20} align="flex-start">
                                                    <Avatar w={150} h={150} mr={20} src={data?.brand?.logo?.hostingUri} />
                                                    <Box>
                                                        <Group mb={10} align="flex-end">
                                                            <Text size="lg" style={{ fontWeight: 'bold' }}>{data?.brand?.name}</Text>
                                                            <StatusBadge statusName={data?.brand?.brandStatus ? data?.brand?.brandStatus : "None"} />
                                                        </Group>
                                                        {data?.brand?.email &&
                                                            <Group align="flex-end">
                                                                <IconMail size={20} />
                                                                <Text>{data?.brand?.email}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.phone &&
                                                            <Group align="flex-end">
                                                                <IconPhone size={20} />
                                                                <Text>{data?.brand?.phone}</Text>
                                                            </Group>
                                                        }
                                                        {data?.brand?.createdDate &&
                                                            <Group mb={20} align="flex-end">
                                                                <IconClock size={20} />
                                                                <Text>Created on: {data?.brand?.createdDate && removeTime(new Date(data?.brand?.createdDate), "/")}</Text>
                                                            </Group>
                                                        }
                                                    </Box>
                                                </Group>
                                                <Button variant="filled" size="sm" color="light-blue.6" mt={20}
                                                    onClick={() => navigate(`/brand/${data?.brand.id}`, {
                                                        state: { tab: "shops", }
                                                    })}>
                                                    View Brand
                                                </Button>
                                            </div>
                                        }
                                    </Tabs.Panel>

                                    <Tabs.Panel value="employees">
                                        <EmployeeListById id={params.shopId!} type="shop" />
                                    </Tabs.Panel>

                                    <Tabs.Panel value="edge boxes">
                                        {data && !installError && dataInstall && dataInstall?.values?.length > 0 ?
                                            <>
                                                {!isLoadingInstall ?
                                                    <Box ml={10} mt={10}>
                                                        <div>
                                                            {/* <Text size='lg' fw={'bold'} fz={25} c={"light-blue.4"}>Shop Installed</Text> */}
                                                            <EdgeBoxInstallListByShopId dataInstalls={dataInstall}
                                                                refetch={refetch} refetchInstall={refetchInstall} />
                                                        </div>
                                                    </Box>
                                                    :
                                                    <Box className={styled["loader"]}>
                                                        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                                    </Box>
                                                }
                                            </>
                                            :
                                            <Text fs="italic" ta="center" c="dimmed" mt={20}>No edge box connected to this shop</Text>
                                        }
                                    </Tabs.Panel>
                                </Tabs>
                            </div>

                            {/* Modal Assign Section */}
                            <Modal opened={modalAssignOpen} onClose={closeAssign} closeOnClickOutside={false}
                                title="Assign Edge Box" centered>
                                <ShopEdgeBoxAssignForm shopId={params.shopId!} close={closeAssign} refetch={refetch} refetchInstall={refetchInstall} />
                            </Modal>
                        </>
                    }
                </div>
            }
        </div >
    );
};

export default ShopDetail;
