import { Box, Button, Grid, Group, LoadingOverlay, Paper, Text } from "@mantine/core";
import { MdHome, MdOutlineAccessTime, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllShops } from "../../hooks/useShops";
import { Shop } from "../../models/Shop";
import { formatTime } from "../../utils/dateTimeFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface ShortShopListParam {
    idType: "brand" | "shopmanager" | "shop";
    id: string;
}

const ShopCard = ({ item }: { item: Shop }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder m={10} h={200}>
            <Group mb={20} justify="space-between">
                <Box>
                    <Text fw={500} size="lg">{item.name}</Text>
                    {item.shopStatus &&
                        <StatusBadge statusName={item?.shopStatus} padding={10} size="sm" />
                    }
                </Box>

                <Button color="light-blue.6" radius="xs" size="xs"
                    onClick={() => navigate(`/shop/${item.id}`, {
                        state: { tab: "brand", }
                    })}>
                    View Shop
                </Button>
            </Group>
            <Box>
                <div className={styled["icon-text"]}>
                    <MdOutlineAccessTime style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}><b>Open:</b> {item?.openTime ? formatTime(item?.openTime, false, false) : "No Data"} - <b>Close:</b> {item?.closeTime ? formatTime(item?.closeTime, false, false) : "No Data"}</span>
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
            </Box>
        </Paper>
    )
}
export const ShopShortListById = ({ idType, id }: ShortShopListParam) => {

    const { isLoading, data, error } = idType == "brand" ? useGetAllShops({ brandId: id }) : useGetAllShops({ shopManagerId: id })

    return (
        <Box>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <Box>
                    {(data?.values.length == 0 || error) ? <Text fs="italic" ta="center" c="dimmed" mt={20}>No Shop Found</Text> :
                        <Grid mt={20} justify="flex-start">
                            {data?.values.map((item, index) => (
                                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                                    <ShopCard item={item} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    }
                </Box>
            }
        </Box>
    )
}