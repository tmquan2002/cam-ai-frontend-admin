import { ActionIcon, Box, Card, Grid, Group, LoadingOverlay, Text, Tooltip } from "@mantine/core";
import { MdOutlineTaskAlt, MdPageview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllEdgeBoxes } from "../../hooks/useEdgeBoxes";
import { EdgeBox } from "../../models/EdgeBox";
import { removeTime } from "../../utils/dateFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EdgeBoxListParam {
    brandId: string;
}

const EdgeBoxCard = ({ item }: { item: EdgeBox }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" m={10} withBorder
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Group mb={10} justify="space-between">
                <Text size='md' fw={'bold'} fz={25} c={"light-blue.6"} >{item.name}</Text>
                <Tooltip label="View Edge Box" withArrow>
                    <ActionIcon variant="filled" size="lg" aria-label="View Edge Box" color="light-blue.6"
                        onClick={() => navigate(`/edgebox/${item.id}`)}>
                        <MdPageview />
                    </ActionIcon>
                </Tooltip>
            </Group>

            <Group grow>
                {item?.edgeBoxStatus &&
                    <Box mb={10} ml={5}>
                        <Text size="xs" c={"dimmed"} fw={500}>Edge Box Status</Text>
                        <StatusBadge statusName={item?.edgeBoxStatus} padding={10} size="sm" tooltip="Edge Box Status" />
                    </Box>
                }
                {item?.edgeBoxLocation &&
                    <Box mb={10} ml={5}>
                        <Text size="xs" c={"dimmed"} fw={500}>Location Status</Text>
                        <StatusBadge statusName={item?.edgeBoxLocation} padding={10} size="sm" tooltip="Location Status" />
                    </Box>
                }
                {item?.version &&
                    <Box mb={10} ml={5}>
                        <Text size="xs" c={"dimmed"} fw={500}>Version</Text>
                        <Text size="md" fw={500}>{item?.version}</Text>
                    </Box>
                }
                {item?.createdDate &&
                    <Box mb={10} ml={5}>
                        <Text size="xs" c={"dimmed"} fw={500}>Created Date</Text>
                        <Text size="md" fw={500}>{removeTime(new Date(item?.createdDate || Date.now()), "/")}</Text>
                    </Box>
                }
            </Group>

            {item.version &&
                <div className={styled["icon-text"]}>
                    <MdOutlineTaskAlt style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.version}</span>
                </div>
            }

        </Card>
    )
}
export const EdgeBoxListByBrandId = ({ brandId }: EdgeBoxListParam) => {

    const { isLoading: isLoadingEdgeBox, data: edgeBoxData, error: edgeBoxError } = useGetAllEdgeBoxes({ brandId: brandId })

    // console.log(installData)
    return (
        <div className={styled["list-container"]}>
            {isLoadingEdgeBox ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box>
                :
                <div className={styled["card-detail"]}>
                    {(edgeBoxData?.values.length == 0 || edgeBoxError) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Edge Box Found</Text> :
                        <Grid mt={20}>
                            {edgeBoxData?.values.map((item, index) => (
                                <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                                    <EdgeBoxCard item={item} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    }
                </div>
            }
        </div>
    )
}