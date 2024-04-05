import { ActionIcon, Box, Card, Divider, Group, LoadingOverlay, Text, Tooltip, useComputedColorScheme } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect } from "react";
import { MdDelete, MdHistory, MdPageview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetEdgeBoxInstallByShopId } from "../../hooks/useEdgeBoxes";
import { EdgeBoxInstall } from "../../models/EdgeBox";
import { removeTime } from "../../utils/dateFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EdgeBoxInstallListParam {
    id: string;
    setAssign: Dispatch<SetStateAction<boolean>>;
}

const InstallCard = ({ item }: { item: EdgeBoxInstall }) => {
    const navigate = useNavigate();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    return (
        <Card padding="lg" radius="md" m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Group justify="space-between">
                <Text size='md' fw={'bold'} fz={25}
                    c={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>
                    {item?.edgeBox?.name}
                </Text>
                <ActionIcon.Group>
                    <Tooltip label="View Edge Box" withArrow>
                        <ActionIcon variant="outline" size="lg" aria-label="View Edge Box"
                            color={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.7"}
                            onClick={() => navigate(`/edgebox/${item.edgeBox.id}`)}>
                            <MdPageview />
                        </ActionIcon>
                    </Tooltip>
                    {/* TODO: Make a log list here */}
                    <Tooltip label="View Old Edge Boxes" withArrow>
                        <ActionIcon variant="outline" size="lg" aria-label="View Old Edge Boxes"
                            color={computedColorScheme == "dark" ? "white" : "black"}
                            onClick={() => { }}>
                            <MdHistory />
                        </ActionIcon>
                    </Tooltip>
                    {/* TODO: Add uninstall API here */}
                    <Tooltip label="Uninstall" withArrow>
                        <ActionIcon variant="outline" size="lg" aria-label="Uninstall" color="pale-red.4">
                            <MdDelete />
                        </ActionIcon>
                    </Tooltip>
                </ActionIcon.Group>
            </Group>

            {/* Edgebox section*/}
            <Group mb={10} mt={10}>
                <Text fw={500} size="sm" c={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>Edge Box</Text>
                {item?.edgeBox?.edgeBoxStatus &&
                    <StatusBadge statusName={item?.edgeBox?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                }
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
            <Text fw={500} size="sm" mb={10} c={computedColorScheme == "dark" ? "light-blue.3" : "light-blue.6"}>Install</Text>
            <Group grow mb={10}>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Install Status</Text>
                    <StatusBadge statusName={item?.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Install Status" />
                </Box>
                <Box mb={10}>
                    <Text size="xs" c={"dimmed"} fw={500}>Activation Status</Text>
                    <StatusBadge statusName={item.activationStatus} padding={10} size="sm" tooltip="Activation Status" />
                </Box>
            </Group>
            <Group grow mb={15}>
                <Box mb={10}>
                    <Text size="xs" c={"dimmed"} fw={500}>Activation Code</Text>
                    <Text size="md" fw={500}>{item?.activationCode || "No Data"}</Text>
                </Box>
                {item.uninstalledTime &&
                    <Box mb={10}>
                        <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Time</Text>
                        <Text size="md" fw={500}>{removeTime(new Date(item.uninstalledTime), "/")}</Text>
                    </Box>
                }
            </Group>
            <Group>
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                    <Text size="md" fw={500}>{removeTime(new Date(item.createdDate || Date.now()), "/")}</Text>
                </Box>
            </Group>
        </Card>
    )
}
export const EdgeBoxInstallListByShopId = ({ id, setAssign }: EdgeBoxInstallListParam) => {

    const { isLoading: isLoadingInstall, data: installData, error: installError } = useGetEdgeBoxInstallByShopId(id);

    useEffect(() => {
        if (installData?.values.length == 0) {
            setAssign(true)
        } else {
            setAssign(false)
        }
    }, [installData])
    // console.log(installData)
    return (
        <div className={styled["list-container"]}>
            {isLoadingInstall ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box>
                :
                <div className={styled["card-detail"]}>
                    {(installData?.values.length == 0 || installError) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Edge Box Found</Text> :
                        <Box mt={5} mb={5}>
                            {installData?.values.map((item, index) => (
                                <InstallCard item={item} key={index} />
                            ))}
                        </Box>
                    }
                </div>
            }
        </div>
    )
}