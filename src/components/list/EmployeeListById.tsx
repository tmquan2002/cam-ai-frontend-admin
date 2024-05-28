import { Box, Card, Group, LoadingOverlay, Text } from "@mantine/core";
import { IconCake, IconGenderFemale, IconGenderMale, IconHome, IconMail, IconPhone } from "@tabler/icons-react";
import { useGetAllEmployees } from "../../hooks/useEmployees";
import { Employee } from "../../models/Employee";
import { Gender } from "../../types/enum";
import { removeTime } from "../../utils/dateTimeFunction";
import StatusBadge from "../badge/StatusBadge";
import styled from "./list.module.scss";

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
                        <IconGenderFemale size={20} /> :
                        <IconGenderMale size={20} />
                    }
                    <span className={styled["information"]}>{item?.gender}</span>
                </div>
            }
            {item?.birthday &&
                <div className={styled["icon-text"]}>
                    <IconCake size={20} />
                    <span className={styled["information"]}>{removeTime(new Date(item?.birthday), "/", "dd/MM/yyyy")}</span>
                </div>
            }
            {item?.email &&
                <div className={styled["icon-text"]}>
                    <IconMail size={20} />
                    <span className={styled["information"]}>{item.email}</span>
                </div>
            }
            {item?.phone &&
                <div className={styled["icon-text"]}>
                    <IconPhone size={20} />
                    <span className={styled["information"]}>{item.phone}</span>
                </div>
            }
            {(item.addressLine || item.ward) &&
                <div className={styled["icon-text"]}>
                    <IconHome size={20} />
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
        <Box>
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <Box>
                    {(data?.values.length == 0 || error) ? <Text fs="italic" ta="center" c="dimmed" mt={20}>No Employee Found</Text> :
                        <Box mt={20}>
                            {data?.values.map((item, index) => (
                                <EmployeeCard item={item} key={index} />
                            ))}
                        </Box>
                    }
                </Box>
            }
        </Box>
    )
}