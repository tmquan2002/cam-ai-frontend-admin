import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddAccountParams } from "../../../../apis/AccountAPI";
import { useAddAccount } from "../../../../hooks/useAccounts";
import { useGetAllBrandsSelect } from "../../../../hooks/useBrands";
import { useGetDistricts, useGetProvinces, useGetWards } from "../../../../hooks/useLocation";
import { Gender, RoleEnum } from "../../../../types/enum";
import { getDateFromSetYear, removeTime } from "../../../../utils/dateFormat";

export const AddAccountForm = () => {
    const [province, setProvince] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [ward, setWard] = useState<string>("");
    const [brand, setBrand] = useState<string | null>(null);

    const { mutate: addAccount, isLoading } = useAddAccount();
    const { data: brandList, isLoading: isLoadingBrand } = useGetAllBrandsSelect({});
    const { data: provinces, isLoading: isLoadingProvinces } = useGetProvinces();
    const { data: districts, isFetching: isFetchingDistricts } = useGetDistricts(province!);
    const { data: wards, isFetching: isFetchingWards } = useGetWards(district!);

    const navigate = useNavigate();

    //TODO: Password should be auto generated, manager will have to change password later
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            name: "",
            gender: '',
            phone: "",
            birthday: new Date(2000, 0),
            addressLine: "",
            roleIds: "",
        },

        validate: {
            name: (value: string) =>
                value.trim().length === 0 ? "Name is required" : null,
            email: (value: string) =>
                value.trim().length === 0 ? "Email is required"
                    : /^\S+@\S+$/.test(value) ? null : "Invalid email",
            phone: (value: string) =>
                value.trim().length === 0 ? "Phone is required" :
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
                        ? null
                        : "Invalid phone number",
            password: (value: string) =>
                value.trim().length === 0 ? "Password is required" : null,
            gender: (value) =>
                value === '' ? "Please choose a gender" : null,
            roleIds: (value) =>
                value === '' ? "Please choose a role" : null,
        },
    });

    const onSubmitForm = async () => {
        // console.log(values)

        const addAccountParams: AddAccountParams = {
            name: form.values.name,
            email: form.values.email,
            phone: form.values.phone,
            addressLine: form.values.addressLine,
            birthday: removeTime(new Date(form.values.birthday), "-"),
            gender: Number(form.values.gender),
            password: form.values.password,
            roleIds: [Number(form.values.roleIds)],
            brandId: brand,
            wardId: ward,
        };
        console.log(addAccountParams)

        addAccount(addAccountParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    message: "Added!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(`/account/${data.id}`)
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        message: "Something wrong happen trying to add a new account",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    return (
        <form style={{ textAlign: "left" }} onSubmit={form.onSubmit(() => onSubmitForm())}>
            <TextInput
                withAsterisk label="Full Name"
                placeholder="Nguyen Van A"
                {...form.getInputProps("name")} />
            <TextInput
                withAsterisk label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")} />
            <TextInput
                withAsterisk label="Password"
                placeholder="Password" type="password"
                {...form.getInputProps("password")} />
            <Group grow>
                <DateInput
                    withAsterisk label="Birthday"
                    placeholder="January 1, 2000"
                    maxDate={getDateFromSetYear(18)}
                    {...form.getInputProps('birthday')} />
                <TextInput
                    label="Phone" placeholder="Phone Number"
                    {...form.getInputProps("phone")} />
                <Select label="Gender" placeholder="Select" withAsterisk
                    data={[
                        // { value: '', label: 'Select' },
                        { value: Gender.Male.toString(), label: 'Male' },
                        { value: Gender.Female.toString(), label: 'Female' },
                    ]}
                    {...form.getInputProps('gender')} />
            </Group>
            <Group grow>
                <Select label="Province" placeholder="Select"
                    data={provinces ? provinces : []}
                    rightSection={isLoadingProvinces ? <Loader size="1rem" /> : null}
                    onChange={(value) => {
                        setProvince(value!)
                        // console.log(value)
                        setDistrict("")
                        setWard("")
                    }}
                    searchable nothingFoundMessage="Not Found"
                />
                <Select label="District" placeholder="Select"
                    disabled={province == ""}
                    data={districts ? districts : []}
                    rightSection={province != "" && isFetchingDistricts ? <Loader size="1rem" /> : null}
                    onChange={(value) => {
                        setDistrict(value!)
                        // console.log(value)
                        setWard("")
                    }}
                    searchable nothingFoundMessage="Not Found"
                />
                <Select label="Ward" placeholder="Select"
                    disabled={district == "" || province == ""}
                    data={wards ? wards : []}
                    rightSection={province != "" && district != "" && isFetchingWards ? <Loader size="1rem" /> : null}
                    onChange={(value) => setWard(value!)}
                    searchable nothingFoundMessage="Not Found"
                />
            </Group>
            <TextInput
                label="Address" placeholder="123/45 ABC..."
                {...form.getInputProps("addressLine")} />
            <Group grow>
                <Select label="Role" placeholder="Select" withAsterisk
                    data={[
                        { value: RoleEnum.Technician.toString(), label: 'Technician' },
                        { value: RoleEnum.BrandManager.toString(), label: 'Brand Manager' },
                    ]}
                    {...form.getInputProps('roleIds')} />
                <Select label="Brand (For Brand Manager)" placeholder="Select"
                    disabled={form.values.roleIds != "3"}
                    data={brandList ? brandList : []}
                    rightSection={isLoadingBrand ? <Loader size="1rem" /> : null}
                    onChange={(value) => setBrand(value!)}
                    searchable limit={5} nothingFoundMessage="Not Found"
                />
            </Group>
            <Group
                justify="flex-start"
                mt="md"
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
