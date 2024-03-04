import { Box, Button, Card, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { MdHome, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllShops } from "../../hooks/useShops";
import { Shop } from "../../models/Shop";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface ShopListParam {
    idType: "brand" | "shopmanager";
    id: string;
}

const ShopCard = ({ item }: { item: Shop }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <div>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.shopStatus &&
                    <StatusBadge statusName={item?.shopStatus} type="shop" mb={15} mt={15} />
                }
            </div>

            {(item.addressLine || item.ward) &&
                <div className={styled["icon-text"]}>
                    <MdHome style={{ width: '20px', height: '20px' }} />
                    {item.addressLine && item.ward ?
                        <span className={styled["information"]}>{item.addressLine}, {item.ward?.name}, {item.ward?.district?.name}, {item.ward?.district?.province?.name}</span>
                        : item.addressLine ? <span className={styled["information"]}>{item.addressLine}</span>
                            : item.ward ? <span className={styled["information"]}>{item.ward?.name}, {item.ward?.district?.name}, {item.ward?.district?.province?.name}</span>
                                : "None"
                    }
                </div>
            }

            {item.phone &&
                <div className={styled["icon-text"]}>
                    <MdPhone style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.phone}</span>
                </div>
            }

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
                    {data?.values.length == 0 ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Shop Found</Text> :
                        <SimpleGrid cols={3} mt={20}>
                            {data?.values.map((item, index) => (
                                <ShopCard item={item} key={index} />
                            ))}
                        </SimpleGrid>
                    }
                </div>
            }
        </div>
    )
}