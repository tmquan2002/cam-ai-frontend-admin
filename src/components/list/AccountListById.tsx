import { Badge, Box, Button, Card, Grid, LoadingOverlay, Text } from "@mantine/core";
import { MdEmail, MdHome } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GetAccountResult } from "../../apis/AccountAPI";
import { useGetAllAccounts } from "../../hooks/useAccounts";
import styled from "./list.module.scss";
import { AccountStatus, StatusColor } from "../../types/enum";

interface AccountListParam {
    id: string;
}

const AccountCard = ({ item }: { item: GetAccountResult }) => {
    console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <div>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.accountStatus &&
                    <Badge size='lg' radius={"lg"} p={17} autoContrast
                        color={item.accountStatus?.id == AccountStatus.Active ? StatusColor.ACTIVE :
                            item.accountStatus?.id == AccountStatus.Inactive ? StatusColor.INACTIVE :
                                item.accountStatus?.id == AccountStatus.New ? StatusColor.NEW : StatusColor.NONE}
                        mt={15} mb={15}>
                        {item.accountStatus?.name}
                    </Badge>
                }
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
                <MdEmail style={{ width: '20px', height: '20px' }}/>
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