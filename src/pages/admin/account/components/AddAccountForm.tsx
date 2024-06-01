import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddAccountParams } from "../../../../apis/AccountAPI";
import { useAddAccount } from "../../../../hooks/useAccounts";
import { useGetAllBrandsSelect } from "../../../../hooks/useBrands";
import { useGetDistricts, useGetProvinces, useGetWards } from "../../../../hooks/useLocation";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../../types/constant";
import { Gender, Role } from "../../../../types/enum";
import { removeTime } from "../../../../utils/dateTimeFunction";
import { enumToSelect } from "../../../../utils/helperFunction";

type AddAccountFieldValue = {
    email: string;
    name: string;
    gender: Gender | null;
    phone: string;
    birthday: Date | null;
    addressLine: string;
    province: string | null;
    district: string | null;
    ward: string | null;
    role: Role;
    brandId: string | null;
};

export const AddAccountForm = ({ initialBrandId, initialBrandName }: { initialBrandId?: string, initialBrandName?: string }) => {
    const [brand, setBrand] = useState<string>(initialBrandName || "");

    const form = useForm<AddAccountFieldValue>({
        initialValues: {
            email: "",
            name: "",
            gender: null,
            phone: "",
            birthday: null,
            addressLine: "",
            role: Role.BrandManager,
            province: null,
            district: null,
            ward: null,
            brandId: initialBrandId ?? null,
        },

        validate: {
            name: isNotEmpty("Name is required"),
            email: (value: string) => isEmpty(value) ? "Email is required"
                : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
            phone: (value: string) => isEmpty(value) ? null :
                PHONE_REGEX.test(value) ? null : "A phone number should have a length of 10-12 characters",
            province: (value, values) => !isEmpty(value) && (isEmpty(values.district) || isEmpty(values.ward)) ? "Please select a district and ward or leave all 3 fields empty" : null,
            district: (value, values) => isEmpty(value) && !isEmpty(values.province) ? "Please select a district" : null,
            ward: (value, values) => isEmpty(value) && (!isEmpty(values.province) || !isEmpty(values.district)) ? "Please select a ward" : null,
            gender: isNotEmpty("Please select a gender"),
            brandId: isNotEmpty("Please select a brand"),
        },
    });

    const { mutate: addAccount, isLoading } = useAddAccount();
    const { data: brandList, refetch: refetchBrand, isFetching: isFetchingBrandList } = useGetAllBrandsSelect({ name: brand, hasManager: false });

    const { data: provincesList } = useGetProvinces();
    const { data: districtsList, isFetching: isFetchingDistricts } = useGetDistricts(form.values.province);
    const { data: wardsList, isFetching: isFetchingWards } = useGetWards(form.values.district);

    const navigate = useNavigate();

    const onSubmitForm = async () => {
        // console.log(values)
        const addAccountParams: AddAccountParams = {
            name: form.values.name,
            email: form.values.email,
            phone: isEmpty(form.values.phone) ? null : form.values.phone,
            addressLine: form.values.addressLine,
            birthday: form.values.birthday ? removeTime(new Date(form.values.birthday), "-", "yyyy/MM/dd") : null,
            gender: form.values.gender,
            role: form.values.role,
            brandId: form.values.brandId,
            wardId: isEmpty(form.values.ward) ? null : form.values.ward,
        };
        // console.log(addAccountParams)

        addAccount(addAccountParams, {
            onSuccess(data) {
                // console.log(data)
                notifications.show({
                    title: "Successfully",
                    message: "New account added!",
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
                        message: "Something wrong happen trying to add a new account",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [brand]);

    return (
        <form style={{ textAlign: "left" }} onSubmit={form.onSubmit(() => onSubmitForm())}>
            <Select label="Brand" data={brandList ?? []} limit={5}
                withAsterisk
                disabled={!isEmpty(initialBrandId)}
                nothingFoundMessage={brandList && "Not Found"}
                searchValue={brand} onSearchChange={setBrand}
                rightSection={isFetchingBrandList ? <Loader size="1rem" /> : null}
                placeholder="Pick value" searchable
                {...form.getInputProps("brandId")}
            />
            <TextInput mt={10}
                withAsterisk label="Full Name"
                placeholder="Nguyen Van A"
                {...form.getInputProps("name")} />
            <TextInput mt={10}
                withAsterisk label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")} />
            <Group grow mt={10} align="baseline">
                <DateInput
                    label="Birthday"
                    placeholder="Birthday"
                    {...form.getInputProps('birthday')} />
                <TextInput
                    label="Phone" placeholder="Phone Number"
                    {...form.getInputProps("phone")} />
                <Select label="Gender" placeholder="Select" withAsterisk
                    allowDeselect={false}
                    data={enumToSelect(Gender ?? {})}
                    {...form.getInputProps('gender')} />
            </Group>
            <Group grow mt={10} align="baseline">
                <Select label="Province" placeholder="Select"
                    data={provincesList ?? []}
                    // rightSection={isLoadingProvinces ? <Loader size="1rem" /> : null}
                    {...form.getInputProps('province')}
                    onChange={(value) => {
                        form.setFieldValue('province', value ?? null)
                        form.setFieldValue('district', null)
                        form.setFieldValue('ward', null)
                    }}
                    searchable clearable nothingFoundMessage="Not Found"
                />
                <Select label="District" placeholder="Select"
                    disabled={form.values.province == null}
                    data={districtsList ?? []}
                    rightSection={isFetchingDistricts ? <Loader size="1rem" /> : null}
                    {...form.getInputProps('district')}
                    onChange={(value) => {
                        form.setFieldValue('district', value ?? null)
                        form.setFieldValue('ward', null)
                    }}
                    searchable clearable nothingFoundMessage="Not Found"
                />
                <Select label="Ward" placeholder="Select"
                    disabled={form.values.province == null || form.values.district == null}
                    data={wardsList ?? []}
                    rightSection={isFetchingWards ? <Loader size="1rem" /> : null}
                    {...form.getInputProps('ward')}
                    searchable clearable nothingFoundMessage="Not Found"
                />
            </Group>
            <TextInput mt={10}
                label="Address" placeholder="123/45 ABC..."
                {...form.getInputProps("addressLine")}
            />
            <Group
                justify="flex-start"
                mt={10}
            >
                <Button
                    loading={isLoading}
                    type="submit"
                    variant="gradient" size="md" mt={20}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Add
                </Button>
            </Group>
        </form>
    );
};
