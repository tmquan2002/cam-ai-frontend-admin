import { Box, Button, Grid, Group, LoadingOverlay, Paper, Text } from "@mantine/core";
import { MdAccountCircle, MdEmail, MdHome } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllAccounts } from "../../hooks/useAccounts";
import { Account } from "../../models/Account";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface AccountListParam {
    id: string;
    type?: "manager" | "employee"
}

const AccountCard = ({ item }: { item: Account }) => {
    // console.log(item)
    const navigate = useNavigate();

    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder m={10} h={200}>
            <Group mb={20} justify="space-between">
                <Box>
                    <Text fw={500} size="lg">{item.name}</Text>
                    {item?.accountStatus &&
                        <StatusBadge statusName={item?.accountStatus} padding={10} size="sm" />
                    }
                </Box>
                <Button color="light-blue.6" radius="xs" size="xs"
                    onClick={() => navigate(`/account/${item.id}`)}>
                    View Account
                </Button>
            </Group>
            <Box>
                <div className={styled["icon-text"]}>
                    <MdAccountCircle style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}><b>{item?.role ? item?.role?.replace(/([A-Z])/g, ' $1').trim() : "None"}</b></span>
                </div>

                {(item?.addressLine || item?.ward) &&
                    <div className={styled["icon-text"]}>
                        <MdHome style={{ width: '20px', height: '20px' }} />
                        {item?.addressLine && item?.ward ?
                            <span className={styled["information"]}>{item?.addressLine}, {item?.ward?.name}, {item?.ward?.district?.name}, {item?.ward?.district?.province?.name}</span>
                            : item?.addressLine ? <span className={styled["information"]}>{item?.addressLine}</span>
                                : <span className={styled["information"]}>{item?.ward?.name}, {item?.ward?.district?.name}, {item?.ward?.district?.province?.name}</span>
                        }
                    </div>
                }
                {item?.email &&
                    <div className={styled["icon-text"]}>
                        <MdEmail style={{ width: '20px', height: '20px' }} />
                        <span className={styled["information"]}>{item?.email}</span>
                    </div>
                }
            </Box>
        </Paper>
    )
}
export const AccountListById = ({ id, type }: AccountListParam) => {

    const { isLoading, data, error } = useGetAllAccounts({ brandId: id })

    console.log(data)
    return (
        <Box>
            {isLoading ?
                <Box>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <Box>
                    {(data?.values.length == 0 || error) ?
                        <Text fs="italic" ta="center" c="dimmed" mt={20}>
                            No {type == "manager" ? "Manager" : type == "employee" ? "Employee" : "Account"} Found
                        </Text> :
                        <Grid mt={20} justify="flex-start">
                            {data?.values.map((item, index) => (
                                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                                    <AccountCard item={item} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    }
                </Box>
            }
        </Box>
    )
}