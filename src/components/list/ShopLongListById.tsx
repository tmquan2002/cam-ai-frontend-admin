import { ActionIcon, Box, Card, Divider, Group, Text, Tooltip, rem } from "@mantine/core";
import { MdDelete, MdHome, MdOutlineAccessTime, MdPageview, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { EdgeBoxInstall } from "../../models/EdgeBox";
import { removeTime } from "../../utils/dateFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

const ShopCard = ({ item }: { item: EdgeBoxInstall }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10} justify="space-between">
                <Group>
                    <Text fw={500} size="lg">{item.shop.name}</Text>
                    {item.shop.shopStatus &&
                        <StatusBadge statusName={item?.shop.shopStatus} padding={10} size="sm" />
                    }
                </Group>
                <ActionIcon.Group>
                    <Tooltip label="View Shop" withArrow>
                        <ActionIcon variant="outline" size="lg" aria-label="View Edge Box" color="light-blue.6"
                            onClick={() => navigate(`/shop/${item.shop.id}`)}>
                            <MdPageview style={{ width: rem(20) }} />
                        </ActionIcon>
                    </Tooltip>
                    {/* TODO: Add uninstall box from a shop here */}
                    <Tooltip label="Uninstall" withArrow>
                        <ActionIcon variant="outline" size="lg" aria-label="Uninstall" color="pale-red.4"
                            onClick={() => {}}>
                            <MdDelete style={{ width: rem(20) }} />
                        </ActionIcon>
                    </Tooltip>
                </ActionIcon.Group>
            </Group>

            <div className={styled["icon-text"]}>
                <MdOutlineAccessTime style={{ width: '20px', height: '20px' }} />
                <span className={styled["information"]}><b>Open:</b> {item?.shop.openTime || "No Data"} - <b>Close:</b> {item?.shop.closeTime || "No Data"}</span>
            </div>

            {(item?.shop.addressLine || item?.shop.ward) &&
                <div className={styled["icon-text"]}>
                    <MdHome style={{ width: '20px', height: '20px' }} />
                    {item.shop.addressLine && item.shop.ward ?
                        <span className={styled["information"]}>{item.shop.addressLine}, {item.shop.ward?.name}, {item.shop.ward?.district?.name}, {item.shop.ward?.district?.province?.name}</span>
                        : item.shop.addressLine ? <span className={styled["information"]}>{item.shop.addressLine}</span>
                            : item.shop.ward ? <span className={styled["information"]}>{item.shop.ward?.name}, {item.shop.ward?.district?.name}, {item.shop.ward?.district?.province?.name}</span>
                                : "None"
                    }
                </div>
            }

            {item.shop.phone &&
                <div className={styled["icon-text"]}>
                    <MdPhone style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.shop.phone}</span>
                </div>
            }

            <Divider mb={10} mt={10} />

            {/* Install Section */}
            <Group grow mb={10} ml={10}>
                <Box mb={10}>
                    <Text size="xs" c={"dimmed"} fw={500}>Install Status</Text>
                    <StatusBadge statusName={item.edgeBoxInstallStatus} padding={10} size="sm" tooltip="Location Status" />
                </Box>
                <Box mb={10}>
                    <Text size="xs" c={"dimmed"} fw={500}>Acivation Status</Text>
                    <StatusBadge statusName={item.activationStatus} padding={10} size="sm" tooltip="Location Status" />
                </Box>
            </Group>
            <Group grow mb={15} ml={10}>
                {item.uninstalledTime &&
                    <Box mb={10}>
                        <Text size="xs" c={"dimmed"} fw={500}>Uninstalled Time</Text>
                        <Text size="md" fw={500}>{removeTime(new Date(item.uninstalledTime), "/")}</Text>
                    </Box>
                }
                <Box>
                    <Text size="xs" c={"dimmed"} fw={500}>Installed Date</Text>
                    <Text size="md" fw={500}>{removeTime(new Date(item.createdDate || Date.now()), "/")}</Text>
                </Box>
            </Group>
        </Card>
    )
}

export const ShopLongListByEdgeBox = ({ data }: { data: EdgeBoxInstall[] }) => {
    return (
        <div className={styled["card-detail"]}>
            <Box mt={10}>
                {data?.map((item, index) => (
                    <ShopCard item={item} key={index} />
                ))}
            </Box>
        </div>
    )
}