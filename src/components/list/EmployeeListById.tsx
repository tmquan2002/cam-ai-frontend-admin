import { Box, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { MdCalendarToday, MdEmail, MdHome, MdPhone } from "react-icons/md";
import { useGetAllEmployees } from "../../hooks/useEmployees";
import { Employee } from "../../models/Employee";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";
import { removeTime } from "../../utils/dateFunction";
import { Gender } from "../../types/enum";

interface EmployeeListParam {
    id: string;
    type: "brand" | "shop";
}

const EmployeeCard = ({ item }: { item: Employee }) => {
    // console.log(item)

    return (
        <Card shadow="sm" padding="lg" radius="md" m={10} withBorder
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <Group mb={10}>
                <Text fw={500} size="lg">{item.name}</Text>
                {item.employeeStatus &&
                    <StatusBadge statusName={item?.employeeStatus} padding={10} size="sm" />
                }
            </Group>
            {item?.gender &&
                <div className={styled["icon-text"]}>
                    {item?.gender == Gender.Female ?
                        <BsGenderFemale style={{ width: '20px', height: '20px' }} /> :
                        <BsGenderMale style={{ width: '20px', height: '20px' }} />
                    }
                    <span className={styled["information"]}>{item?.gender}</span>
                </div>
            }
            {item?.birthday &&
                <div className={styled["icon-text"]}>
                    <MdCalendarToday style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{removeTime(new Date(item?.birthday), "/", "dd/MM/yyyy")}</span>
                </div>
            }
            {item?.email &&
                <div className={styled["icon-text"]}>
                    <MdEmail style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.email}</span>
                </div>
            }
            {item?.phone &&
                <div className={styled["icon-text"]}>
                    <MdPhone style={{ width: '20px', height: '20px' }} />
                    <span className={styled["information"]}>{item.phone}</span>
                </div>
            }
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
        </Card>
    )
}
export const EmployeeListById = ({ id, type }: EmployeeListParam) => {

    const { isLoading, data, error } = type == "shop" ? useGetAllEmployees({ shopId: id }) : useGetAllEmployees({ brandId: id })

    return (
        <div className={styled["list-container"]}>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["card-detail"]}>
                    {(data?.values.length == 0 || error) ? <Text c="dimmed" w={'100%'} ta={"center"} mt={20}>No Employee Found</Text> :
                        <Box mt={20}>
                            {data?.values.map((item, index) => (
                                <EmployeeCard item={item} key={index} />
                            ))}
                        </Box>
                    }
                </div>
            }
        </div>
    )
}