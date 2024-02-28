import { Box, Card, LoadingOverlay, SimpleGrid, Text } from "@mantine/core";
import { MdHome, MdPhone } from "react-icons/md";
import { useGetAllEmployees } from "../../hooks/useEmployees";
import { Employee } from "../../models/Employee";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

interface EmployeeListParam {
    id: string;
    type: "brand" | "shop";
}

const EmployeeCard = ({ item }: { item: Employee }) => {
    console.log(item)

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder m={10}
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <div>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.employeeStatus &&
                    <StatusBadge statusName={item?.employeeStatus} type="shop" mb={15} mt={15} />
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
                <MdPhone style={{ width: '20px', height: '20px' }} />
                <span className={styled["information"]}>{item.phone}</span>
            </div>
        </Card>
    )
}
export const EmployeeListById = ({ id, type }: EmployeeListParam) => {

    const { isLoading, data } = type == "shop" ? useGetAllEmployees({ shopId: id }) : useGetAllEmployees({ brandId: id })

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {data?.values.length == 0 ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Employee Found</Text> :
                        <SimpleGrid cols={3} mt={20}>
                            {data?.values.map((item, index) => (
                                <EmployeeCard item={item} key={index} />
                            ))}
                        </SimpleGrid>
                    }
                </div>
            }
        </div>
    )
}