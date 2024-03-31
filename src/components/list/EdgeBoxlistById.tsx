import { ActionIcon, Box, Button, Card, Divider, Group, LoadingOverlay, Text, Tooltip, rem } from "@mantine/core";
import { MdDelete, MdOutlineTaskAlt, MdPageview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllEdgeBoxes, useGetEdgeBoxInstallByShopId } from "../../hooks/useEdgeBoxes";
import { EdgeBox, EdgeBoxInstall } from "../../models/EdgeBox";
import { removeTime } from "../../utils/dateFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EdgeBoxListParam {
    type: "brand" | "shop" | "install";
    id: string;
}

const EdgeBoxCard = ({ item }: { item: EdgeBox }) => {
    // console.log(item)
    const navigate = useNavigate();

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
            </Group>

            {item.version &&
                <div className={styled["icon-text"]}>
                    <MdOutlineTaskAlt style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.version}</span>
                </div>
            }
            <Button color="light-blue.6" mt="sm" radius="xs"
                onClick={() => navigate(`/edgebox/${item.id}`)}>
                View Edge Box
            </Button>
        </Card>
    )
}

const InstallCard = ({ item }: { item: EdgeBoxInstall }) => {
    const navigate = useNavigate();
    return (
        <Card shadow="sm" padding="lg" radius="md" m={10} withBorder
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Group justify="space-between">
                <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"}>{item?.edgeBox?.name}</Text>
                <ActionIcon.Group>
                    <Tooltip label="View Edge Box" withArrow>
                        <ActionIcon variant="filled" size="lg" aria-label="View Edge Box" color="light-blue.6"
                            onClick={() => navigate(`/edgebox/${item.edgeBox.id}`)}>
                            <MdPageview style={{ width: rem(20) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Uninstall" withArrow>
                        <ActionIcon variant="filled" size="lg" aria-label="Uninstall" color="pale-red.4">
                            <MdDelete style={{ width: rem(20) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </ActionIcon.Group>
            </Group>

            {/* Edgebox section*/}
            <Group mb={10} mt={10}>
                <Text fw={500} size="sm" c={"light-blue.6"}>Edge Box</Text>
                {item?.edgeBox?.edgeBoxStatus &&
                    <StatusBadge statusName={item?.edgeBox?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                }
                {/* TODO: Add one more status and start date here */}
            </Group>
            <Group grow mb={20}>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                    <Text size="md" fw={500}>{item?.edgeBox?.version || "No Data"}</Text>
                </Box>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                    <StatusBadge statusName={item?.edgeBox?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                </Box>
            </Group>
            <Group grow mb={15}>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Model</Text>
                    <Text size="md" fw={500}>{item?.edgeBox?.edgeBoxModel?.name || "No Data"}</Text>
                </Box>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Created On</Text>
                    <Text size="md" fw={500}>{removeTime(new Date(item?.edgeBox?.createdDate || Date.now()), "/")}</Text>
                </Box>
            </Group>

            {/* Install section*/}
            <Divider mb={10} />
            <Text fw={500} size="sm" mb={10} c={"light-blue.6"}>Install</Text>
            <Group grow mb={10}>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Install Status</Text>
                    <StatusBadge statusName={item?.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Install Status" />
                </Box>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Installed Date</Text>
                    <Text size="md" fw={500}>{removeTime(new Date(item?.createdDate || Date.now()), "/")}</Text>
                </Box>
            </Group>
        </Card>
    )
}
export const EdgeBoxListById = ({ id, type }: EdgeBoxListParam) => {

    const { isLoading: isLoadingEdgeBox, data: edgeBoxData, error: edgeBoxError } = type == "brand" ? useGetAllEdgeBoxes({ brandId: id }) : useGetAllEdgeBoxes({ shopId: id })
    const { isLoading: isLoadingInstall, data: installData, error: installError } = useGetEdgeBoxInstallByShopId(id);

    // console.log(installData)
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
                                <Box mt={5} mb={5}>
                                    {installData?.values.map((item, index) => (
                                        <InstallCard item={item} key={index} />
                                    ))}
                                </Box>
                            }
                        </>
                        :
                        <>
                            {(edgeBoxData?.values.length == 0 || edgeBoxError) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Edge Box Found</Text> :
                                <Box mt={5} mb={5}>
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