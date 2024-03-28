import { Box, Button, Card, Grid, Group, LoadingOverlay, Text } from "@mantine/core";
import { MdHome, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllShops } from "../../hooks/useShops";
import { Shop } from "../../models/Shop";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";
import { EdgeBoxInstall } from "../../models/EdgeBox";

interface ShortShopListParam {
    idType: "brand" | "shopmanager" | "shop";
    id: string;
}

const ShopCard = ({ item }: { item: Shop }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10}>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.shopStatus &&
                    <StatusBadge statusName={item?.shopStatus} padding={10} size="sm" />
                }
            </Group>

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
                View Shop
            </Button>
        </Card>
    )
}
export const ShopShortListById = ({ idType, id }: ShortShopListParam) => {

    const { isLoading, data, error } = idType == "brand" ? useGetAllShops({ brandId: id }) : useGetAllShops({ shopManagerId: id })

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {(data?.values.length == 0 || error) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Shop Found</Text> :
                        <Grid mt={20}>
                            {data?.values.map((item, index) => (
                                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                                    <ShopCard item={item} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    }
                </div>
            }
        </div>
    )
}

export const ShopShortListByEdgeBox = ({ data }: { data: EdgeBoxInstall[] }) => {
    return (
        <div className={styled["card-detail"]}>
            <Grid mt={20}>
                {data?.map((item, index) => (
                    <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                        <ShopCard item={item.shop} />
                    </Grid.Col>
                ))}
            </Grid>
        </div>
    )
}