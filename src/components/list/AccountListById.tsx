import { Box, Button, Card, Grid, LoadingOverlay, Text } from "@mantine/core";
import { MdAccountCircle, MdEmail, MdHome } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetAllAccounts } from "../../hooks/useAccounts";
import { Account } from "../../models/Account";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface AccountListParam {
    id: string;
}

const AccountCard = ({ item }: { item: Account }) => {
    console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <div>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.accountStatus &&
                    <StatusBadge statusName={item.accountStatus?.name} type="account" statusId={item?.accountStatus?.id} mb={15} mt={15} />
                }
            </div>

            <div className={styled["icon-text"]}>
                <MdAccountCircle style={{ width: '20px', height: '20px' }}/>
                <span className={styled["information"]}><b>{item.roles[0].name}</b></span>
            </div>

            <div className={styled["icon-text"]}>
                <MdHome style={{ width: '20px', height: '20px' }} />
                {item.addressLine && item.ward ?
                    <span className={styled["information"]}>{item.addressLine}, {item.ward?.name}, {item.ward?.district?.name}, {item.ward?.district?.province?.name}</span>
                    : item.addressLine ? <span className={styled["information"]}>{item.addressLine}</span>
                        : item.ward ? <span className={styled["information"]}>{item.ward?.name}, {item.ward?.district?.name}, {item.ward?.district?.province?.name}</span>
                            : "None"
                }
            </div>

            <div className={styled["icon-text"]}>
                <MdEmail style={{ width: '20px', height: '20px' }} />
                <span className={styled["information"]}>{item.email}</span>
            </div>

            <Button color="light-blue.6" fullWidth mt="md" radius="xs"
                onClick={() => navigate(`/account/${item.id}`)}>
                View Detail
            </Button>
        </Card>
    )
}
export const AccountListById = ({ id }: AccountListParam) => {

    const { isLoading, data } = useGetAllAccounts({ brandId: id })

    return (
        <div>
            {isLoading ?
                <Box>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div>
                    {data?.values.length == 0 ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Account Found</Text> :
                        <Grid mt={20}>
                            {data?.values.map((item, index) => (
                                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                                    <AccountCard item={item} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    }
                </div>
            }
        </div>
    )
}