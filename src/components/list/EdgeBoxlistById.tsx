import { Box, Button, Card, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { MdHome, MdOutlineTaskAlt } from "react-icons/md";
import { useGetAllEdgeBoxes } from "../../hooks/useEdgeBoxes";
import { EdgeBox } from "../../models/EdgeBox";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";
import { useNavigate } from "react-router-dom";

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

            <div>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.edgeBoxStatus &&
                    <StatusBadge statusName={item.edgeBoxStatus} type="shop" mb={15} mt={15} />
                }
            </div>

            <div className={styled["icon-text"]}>
                <MdHome style={{ width: '20px', height: '20px' }} />
                <span className={styled["information"]}>{item?.edgeBoxLocation}</span>
            </div>

            <div className={styled["icon-text"]}>
                <MdOutlineTaskAlt style={{ width: '20px', height: '20px' }} />
                <span className={styled["information"]}>{item.version}</span>
            </div>

            <Button color="light-blue.6" fullWidth mt="md" radius="xs"
                onClick={() => navigate(`/edgebox/${item.id}`)}>
                View Detail
            </Button>
        </Card>
    )
}
export const EdgeBoxListById = ({ id, type }: EdgeBoxListParam) => {

    const { isLoading, data } = type == "brand" ? useGetAllEdgeBoxes({brandId: id}) : useGetAllEdgeBoxes({shopId: id})

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {data?.values.length == 0 ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Edge Box Found</Text> :
                        <SimpleGrid cols={3} mt={20}>
                            {data?.values.map((item, index) => (
                                <EdgeBoxCard item={item} key={index} />
                            ))}
                        </SimpleGrid>
                    }
                </div>
            }
        </div>
    )
}