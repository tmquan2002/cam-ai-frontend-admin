import { Button, Group, Loader, Select, Text, TextInput } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateAccountParams } from "../../../../apis/AccountAPI";
import { useGetAccountById, useUpdateAccount } from "../../../../hooks/useAccounts";
import { useGetDistricts, useGetProvinces, useGetWards } from "../../../../hooks/useLocation";
import { Gender } from "../../../../types/enum";
import { getDateFromSetYear, removeTime } from "../../../../utils/dateFunction";
import { isEmpty } from "lodash";
import { enumToSelect } from "../../../../utils/helperFunction";

type UpdateAccountFieldValue = {
    email: string;
    name: string;
    gender: Gender;
    phone: string;
    birthday: Date | null;
    addressLine: string;
    province: string;
    district: string;
    ward: string | null;
};

export const UpdateAccountForm = ({ id }: { id: string }) => {
    const [provinceSearch, setProvinceSearch] = useState<string>("");
    const [districtSearch, setDistrictSearch] = useState<string>("");
    const [wardSearch, setWardSearch] = useState<string>("");

    const { data, isLoading: initialDataLoading, error } = useGetAccountById(id);

    const form = useForm<UpdateAccountFieldValue>({
        initialValues: {
            email: "",
            name: "",
            gender: Gender.Male,
            phone: "",
            birthday: null,
            addressLine: "",
            province: "",
            district: "",
            ward: "",
        },

        validate: {
            name: (value: string) =>
                isEmpty(value) ? "Name is required" : null,
            email: (value: string) =>
                isEmpty(value) ? "Email is required"
                    : /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "An email should have a name, @ sign, a server name and domain in order and no whitespace. Valid example abc@email.com",
            phone: (value: string) =>
                isEmpty(value) ? null :
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
                        ? null
                        : "A Phone number should have a length of 10-12 characters",
        },
        enhanceGetInputProps: (payload) => {
            if (!payload.form.initialized) {
                return { disabled: true };
            }
            return {};
        },
    });

    const { mutate: updateAccount, isLoading } = useUpdateAccount();
    const { data: provinceList, isLoading: isLoadingProvinces } = useGetProvinces();
    const { data: districtList, isFetching: isFetchingDistricts } = useGetDistricts(form.values.province);
    const { data: wardList, isFetching: isFetchingWards } = useGetWards(form.values.district);

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            // Even if data changes, form will be initialized only once
            form.initialize({
                email: data?.email || "",
                name: data?.name || "",
                phone: data?.phone || "",
                addressLine: data?.addressLine || "",
                gender: data?.gender || Gender.Male,
                birthday: data?.birthday ? new Date(data?.birthday) : new Date(2000, 0),
                province: data?.ward?.district?.province?.id.toString() || "",
                district: data?.ward?.district?.id.toString() || "",
                ward: data?.ward?.id.toString() || ""
            })
        }
    }, [data]);

    const onSubmitForm = async () => {
        // console.log(values)

        const updateAccountParams: UpdateAccountParams = {
            id,
            values: {
                name: form.values.name,
                email: form.values.email,
                phone: form.values.phone,
                addressLine: form.values.addressLine,
                birthday: form.values.birthday ? removeTime(new Date(form.values.birthday), "-", "yyyy/MM/dd") : null,
                gender: form.values.gender,
                wardId: isEmpty(form.values.ward) ? null : form.values.ward,
            }
        };
        // console.log(updateAccountParams)

        updateAccount(updateAccountParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    title: "Successfully",
                    message: "Account Update Successful!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(`/account/${data.id}`)
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        title: "Failed",
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        title: "Failed",
                        message: "Something wrong happen trying to update this account",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    return (
        <>
            {(initialDataLoading || isLoadingProvinces) ? <Loader /> :
                <>
                    {error ? <Text w={'100%'} c="dimmed" mt={20} ta="center">Account not found</Text> :
                        <form style={{ textAlign: "left" }} onSubmit={form.onSubmit(() => onSubmitForm())}>
                            <TextInput mt={10}
                                withAsterisk label="Full Name"
                                placeholder="Nguyen Van A"
                                {...form.getInputProps("name")} />
                            <TextInput mt={10}
                                withAsterisk label="Email"
                                placeholder="your@email.com"
                                {...form.getInputProps("email")} />
                            <Group grow mt={10}>
                                <DateInput
                                    label="Birthday"
                                    placeholder="January 1, 2000"
                                    maxDate={getDateFromSetYear(18)}
                                    {...form.getInputProps('birthday')} />
                                <TextInput
                                    label="Phone" placeholder="Phone Number"
                                    {...form.getInputProps("phone")} />
                                <Select label="Gender" placeholder="Select" withAsterisk
                                    allowDeselect={false}
                                    data={enumToSelect(Gender ?? {})}
                                    {...form.getInputProps('gender')} />
                            </Group>
                            <Group grow mt={10}>
                                <Select label="Province" placeholder="Select"
                                    data={provinceList || []}
                                    // rightSection={isLoadingProvinces ? <Loader size="1rem" /> : null}
                                    {...form.getInputProps('province')}
                                    onChange={(value) => {
                                        form.setFieldValue('province', value || "")
                                        setDistrictSearch("");
                                        setWardSearch("");
                                    }}
                                    searchValue={provinceSearch} onSearchChange={setProvinceSearch}
                                    searchable nothingFoundMessage="Not Found"
                                />
                                <Select label="District" placeholder="Select"
                                    disabled={form.values.province == ""}
                                    data={districtList || []}
                                    rightSection={form.values.province != "" && isFetchingDistricts ? <Loader size="1rem" /> : null}
                                    {...form.getInputProps('district')}
                                    onChange={(value) => {
                                        form.setFieldValue('district', value || "")
                                        setWardSearch("");
                                    }}
                                    searchValue={districtSearch} onSearchChange={setDistrictSearch}
                                    searchable nothingFoundMessage="Not Found"
                                />
                                <Select label="Ward" placeholder="Select"
                                    disabled={form.values.province == "" || districtSearch == ""}
                                    data={wardList || []}
                                    rightSection={form.values.province != "" && districtSearch != "" && isFetchingWards ? <Loader size="1rem" /> : null}
                                    {...form.getInputProps('ward')}
                                    searchValue={wardSearch} onSearchChange={setWardSearch}
                                    searchable nothingFoundMessage="Not Found"
                                />
                            </Group>
                            <TextInput mt={10}
                                label="Address" placeholder="123/45 ABC..."
                                {...form.getInputProps("addressLine")} />
                            <Group
                                justify="flex-start"
                                mt={10}
                            >
                                <Button loading={isLoading} type="submit" variant="gradient" size="md" mt={20}
                                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                                >
                                    Update
                                </Button>
                                <Button loading={isLoading} variant="outline" size="md" mt={20} color="pale-red.9"
                                    onClick={() => {
                                        form.setValues({
                                            email: data?.email ? data.email : "",
                                            name: data?.name ? data.name : "",
                                            phone: data?.phone ? data.phone : "",
                                            addressLine: data?.addressLine ? data.addressLine : "",
                                            gender: data?.gender || Gender.Male,
                                            birthday: data?.birthday ? new Date(data?.birthday) : new Date(2000, 0),
                                            province: data?.ward?.district.province.id ? data?.ward?.district.province.id.toString() : "",
                                            district: data?.ward?.district?.id.toString() || "",
                                            ward: data?.ward?.id.toString() || ""
                                        })
                                        setProvinceSearch(data?.ward?.district?.province?.name || "")
                                        setDistrictSearch(data?.ward?.district.name || "")
                                        setWardSearch(data?.ward?.name || "")
                                    }}>
                                    Reset
                                </Button>
                            </Group>
                        </form >
                    }
                </>
            }
        </>
    );
};
