import { ActionIcon, Box, Card, Group, LoadingOverlay, Text, Tooltip, rem } from "@mantine/core";
import { MdDelete, MdHome, MdOutlineAccessTime, MdPageview, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllShops } from "../../hooks/useShops";
import { EdgeBoxInstall } from "../../models/EdgeBox";
import { Shop } from "../../models/Shop";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface LongShopListParam {
    idType: "brand" | "shopmanager" | "shop";
    id: string;
}

const ShopCard = ({ item }: { item: Shop }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10} justify="space-between">
                <Group>
                    <Text fw={500} size="lg">{item.name}</Text>
                    {item.shopStatus &&
                        <StatusBadge statusName={item?.shopStatus} padding={10} size="sm" />
                    }
                </Group>
                <ActionIcon.Group>
                    <Tooltip label="View Shop" withArrow>
                        <ActionIcon variant="filled" size="lg" aria-label="View Edge Box" color="light-blue.6"
                            onClick={() => navigate(`/shop/${item.id}`)}>
                            <MdPageview style={{ width: rem(20) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                    {/* TODO: Add uninstall box from a shop here */}
                    <Tooltip label="Uninstall" withArrow>
                        <ActionIcon variant="filled" size="lg" aria-label="Uninstall" color="pale-red.4"
                            onClick={() => navigate(`/shop/${item.id}`)}>
                            <MdDelete style={{ width: rem(20) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </ActionIcon.Group>
            </Group>

            <div className={styled["icon-text"]}>
                <MdOutlineAccessTime style={{ width: '20px', height: '20px' }} />
                <span className={styled["information"]}><b>Open:</b> {item?.openTime || "No Data"} - <b>Close:</b> {item?.closeTime || "No Data"}</span>
            </div>

            {(item?.addressLine || item?.ward) &&
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
        </Card>
    )
}
export const ShopLongListById = ({ idType, id }: LongShopListParam) => {

    const { isLoading, data, error } = idType == "brand" ? useGetAllShops({ brandId: id }) : useGetAllShops({ shopManagerId: id })

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {(data?.values.length == 0 || error) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Shop Found</Text> :
                        <Box mt={20}>
                            {data?.values.map((item, index) => (
                                <ShopCard item={item} key={index} />
                            ))}
                        </Box>
                    }
                </div>
            }
        </div>
    )
}

export const ShopLongListByEdgeBox = ({ data }: { data: EdgeBoxInstall[] }) => {
    return (
        <div className={styled["card-detail"]}>
            <Box mt={10}>
                {data?.map((item, index) => (
                    <ShopCard item={item.shop} key={index} />
                ))}
            </Box>
        </div>
    )
}