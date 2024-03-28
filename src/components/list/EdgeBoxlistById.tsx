import { Box, Button, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { MdOutlineTaskAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllEdgeBoxes } from "../../hooks/useEdgeBoxes";
import { EdgeBox } from "../../models/EdgeBox";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EdgeBoxListParam {
    type: "brand" | "shop";
    id: string;
}

const EdgeBoxCard = ({ item }: { item: EdgeBox }) => {
    const navigate = useNavigate();
    // console.log(item)

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10}>
                <Text fw={500} size="lg">{item.name}</Text>
                {item?.edgeBoxStatus &&
                    <StatusBadge statusName={item?.edgeBoxStatus} padding={10} size="sm" />
                }
                {item?.edgeBoxLocation &&
                    <StatusBadge statusName={item?.edgeBoxLocation} padding={10} size="sm" />
                }
                {/* TODO: Add one more status here */}
            </Group>

            {item.version &&
                <div className={styled["icon-text"]}>
                    <MdOutlineTaskAlt style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.version}</span>
                </div>
            }
            <Button color="light-blue.6" fullWidth mt="md" radius="xs"
                onClick={() => navigate(`/edgebox/${item.id}`)}>
                View Edge Box
            </Button>
        </Card>
    )
}
export const EdgeBoxListById = ({ id, type }: EdgeBoxListParam) => {

    const { isLoading, data, error } = type == "brand" ? useGetAllEdgeBoxes({ brandId: id }) : useGetAllEdgeBoxes({ shopId: id })

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {(data?.values.length == 0 || error) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Edge Box Found</Text> :
                        <Box mt={20}>
                            {data?.values.map((item, index) => (
                                <EdgeBoxCard item={item} key={index} />
                            ))}
                        </Box>
                    }
                </div>
            }
        </div>
    )
}