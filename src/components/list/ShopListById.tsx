import { Badge, Box, Button, Card, Group, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { MdHome, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllShops } from "../../hooks/useShops";
import { Shop } from "../../models/Shop";
import styled from "./list.module.scss";

interface ShopListParam {
    idType: "brand" | "shopmanager";
    id: string;
}

const ShopCard = ({ item }: { item: Shop }) => {
    console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500} size="lg">{item.name}</Text>
                {item.shopStatus &&
                    <Badge size='lg' radius={"lg"} color="shading.9">
                        {item.shopStatus.name}
                    </Badge>
                }
            </Group>

            <Group>
                <MdHome />
                <Text size="sm" c="dimmed">{item.addressLine}, {item.ward?.name}, {item.ward?.district?.name}, {item.ward?.district?.province?.name}</Text>
            </Group>

            <Group>
                <MdPhone />
                <Text size="sm" c="dimmed">{item.phone}</Text>
            </Group>

            <Button color="light-blue.6" fullWidth mt="md" radius="xs"
                onClick={() => navigate(`/shop/${item.id}`)}>
                View Detail
            </Button>
        </Card>
    )
}
export const ShopListById = ({ idType, id }: ShopListParam) => {

    const { isLoading, data } = idType == "brand" ? useGetAllShops({ brandId: id }) : useGetAllShops({ shopManagerId: id })

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    <Text size="lg" fw={"bold"}>Shops</Text>
                    <SimpleGrid cols={3}>
                        {data?.values.map((item, index) => (
                            <ShopCard item={item} key={index} />
                        ))}
                    </SimpleGrid>
                </div>
            }
        </div>
    )
}