import { Badge, Box, Button, Card, Group, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { MdEmail, MdHome } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GetAccountResult } from "../../apis/AccountAPI";
import { useGetAllAccounts } from "../../hooks/useAccounts";
import styled from "./list.module.scss";

interface AccountListParam {
    id: string;
}

const AccountCard = ({ item }: { item: GetAccountResult }) => {
    console.log(item)
    const navigate = useNavigate();

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500} size="lg">{item.name}</Text>
                {item.accountStatus &&
                    <Badge size='lg' radius={"lg"} color="shading.9">
                        {item.accountStatus.name}
                    </Badge>
                }
            </Group>

            <Group>
                <MdHome />
                <Text size="sm" c="dimmed">{item.addressLine}, {item.ward?.name}, {item.ward?.district?.name}, {item.ward?.district?.province?.name}</Text>
            </Group>

            <Group>
                <MdEmail />
                <Text size="sm" c="dimmed">{item.email}</Text>
            </Group>

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
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {data?.values.length == 0 ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Account Found</Text> :
                        <SimpleGrid cols={3} mt={20}>
                            {data?.values.map((item, index) => (
                                <AccountCard item={item} key={index} />
                            ))}
                        </SimpleGrid>
                    }
                </div>
            }
        </div>
    )
}