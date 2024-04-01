import { Box, Button, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { MdOutlineTaskAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllEdgeBoxes } from "../../hooks/useEdgeBoxes";
import { EdgeBox } from "../../models/EdgeBox";
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
export const EdgeBoxListById = ({ id, type }: EdgeBoxListParam) => {

    const { isLoading: isLoadingEdgeBox, data: edgeBoxData, error: edgeBoxError } = type == "brand" ? useGetAllEdgeBoxes({ brandId: id }) : useGetAllEdgeBoxes({ shopId: id })

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
                        <Box mt={5} mb={5}>
                            {edgeBoxData?.values.map((item, index) => (
                                <EdgeBoxCard item={item} key={index} />
                            ))}
                        </Box>
                    }
                </div>
            }
        </div>
    )
}