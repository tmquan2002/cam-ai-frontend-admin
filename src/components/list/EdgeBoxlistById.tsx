import { Box, Button, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { MdAccessTime, MdOutlineTaskAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllEdgeBoxes, useGetEdgeBoxInstallByShopId } from "../../hooks/useEdgeBoxes";
import { EdgeBox, EdgeBoxInstall } from "../../models/EdgeBox";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EdgeBoxListParam {
    type: "brand" | "shop" | "install";
    id: string;
}

const EdgeBoxCard = ({ item }: { item: EdgeBox }) => {
    const navigate = useNavigate();
    // console.log(item)

    return (
        <Card shadow="sm" padding="lg" radius="md" m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10}>
                <Text fw={500} size="lg">{item.name}</Text>
                {item?.edgeBoxStatus &&
                    <StatusBadge statusName={item?.edgeBoxStatus} padding={10} size="sm" />
                }
                {item?.edgeBoxLocation &&
                    <StatusBadge statusName={item?.edgeBoxLocation} padding={10} size="sm" tooltip="Location" />
                }
                {/* TODO: Add one more status here */}
            </Group>

            {item.version &&
                <div className={styled["icon-text"]}>
                    <MdOutlineTaskAlt style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.version}</span>
                </div>
            }
            <Group grow >
                <Button color="light-blue.6" mt="sm" radius="xs"
                    onClick={() => navigate(`/edgebox/${item.id}`)}>
                    View Edge Box
                </Button>
                {/* TODO: Add uninstall box here */}
                <Button color="pale-red.4" mt="sm" radius="xs"
                    onClick={() => navigate(`/edgebox/${item.id}`)}>
                    Uninstall
                </Button>
            </Group>
        </Card>
    )
}

const InstallCard = ({ item }: { item: EdgeBoxInstall }) => {

    return (
        <Card shadow="sm" padding="lg" radius="md" m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10}>
                {item?.edgeBoxInstallStatus &&
                    <StatusBadge statusName={item?.edgeBoxInstallStatus} padding={10} size="sm" />
                }
            </Group>

            {item?.createdDate &&
                <div className={styled["icon-text"]}>
                    <MdAccessTime style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>Created on: {item.createdDate}</span>
                </div>
            }
        </Card>
    )
}
export const EdgeBoxListById = ({ id, type }: EdgeBoxListParam) => {

    const { isLoading: isLoadingEdgeBox, data: edgeBoxData, error: edgeBoxError } = type == "brand" ? useGetAllEdgeBoxes({ brandId: id }) : useGetAllEdgeBoxes({ shopId: id })
    const { isLoading: isLoadingInstall, data: installData, error: installError } = useGetEdgeBoxInstallByShopId(id);

    return (
        <div className={styled["list-container"]}>
            {isLoadingEdgeBox || isLoadingInstall ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {type == "install" ?
                        <>
                            {(installData?.values.length == 0 || installError) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Installs Found</Text> :
                                <Box mt={20}>
                                    {installData?.values.map((item, index) => (
                                        <InstallCard item={item} key={index} />
                                    ))}
                                </Box>
                            }
                        </>
                        :
                        <>
                            {(edgeBoxData?.values.length == 0 || edgeBoxError) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Edge Box Found</Text> :
                                <Box mt={20}>
                                    {edgeBoxData?.values.map((item, index) => (
                                        <EdgeBoxCard item={item} key={index} />
                                    ))}
                                </Box>
                            }
                        </>
                    }
                </div>
            }
        </div>
    )
}