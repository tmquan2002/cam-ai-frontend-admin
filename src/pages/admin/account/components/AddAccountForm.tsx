import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddAccountParams } from "../../../../apis/AccountAPI";
import { useAddAccount } from "../../../../hooks/useAccounts";
import { useGetAllBrandsSelect } from "../../../../hooks/useBrands";
import { useGetDistricts, useGetProvinces, useGetWards } from "../../../../hooks/useLocation";
import { Gender, RoleEnum } from "../../../../types/enum";
import { getDateFromSetYear, removeTime } from "../../../../utils/dateFunction";
import { isEmpty } from "lodash";

export const AddAccountForm = ({ initialBrandId, initialBrandName }: { initialBrandId?: string, initialBrandName?: string }) => {
    const [brand, setBrand] = useState<string>(initialBrandName || "");
    const [districtSearch, setDistrictSearch] = useState<string>("");
    const [wardSearch, setWardSearch] = useState<string>("");
    const [brandId, setBrandId] = useState<string | null>(initialBrandId || null);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            gender: '',
            phone: "",
            birthday: new Date(2000, 0),
            addressLine: "",
            role: initialBrandId ? RoleEnum.BrandManager : "",
            province: "",
            district: "",
            ward: "",
        },

        validate: {
            name: (value: string) =>
                value.trim().length === 0 ? "Name is required" : null,
            email: (value: string) =>
                value.trim().length === 0 ? "Email is required"
                    : /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "An email should have a name, @ sign, a server name and domain in order and no whitespace. Valid example abc@email.com",
            phone: (value: string) =>
                value.trim().length === 0 ? "Phone is required" :
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
                        ? null
                        : "A Phone number should have a length of 10-12 characters",
            password: (value: string) =>
                value.trim().length === 0 ? "Password is required" : null,
            confirmPassword: (value: string) =>
                value.trim().length === 0 ? "Confirm Password is required" : null,
            gender: (value) =>
                value === '' ? "Please choose a gender" : null,
            role: (value) =>
                value === '' ? "Please choose a role" : null,
        },
    });

    const { mutate: addAccount, isLoading } = useAddAccount();
    const { data: brandList, refetch: refetchBrand } = useGetAllBrandsSelect({ name: brand, hasManager: false });

    const { data: provincesList } = useGetProvinces();
    const { data: districtsList, isFetching: isFetchingDistricts } = useGetDistricts(form.values.province);
    const { data: wardsList, isFetching: isFetchingWards } = useGetWards(form.values.district);

    const navigate = useNavigate();

    const onSubmitForm = async () => {
        // console.log(values)

        if (form.values.password !== form.values.confirmPassword) {
            notifications.show({
                message: "Password and Confirm Password does not match",
                color: "pale-red.5",
                withCloseButton: true,
            });
            return;
        }
        const addAccountParams: AddAccountParams = {
            name: form.values.name,
            email: form.values.email,
            phone: form.values.phone,
            addressLine: form.values.addressLine,
            birthday: removeTime(new Date(form.values.birthday), "-", "yyyy/MM/dd"),
            gender: form.values.gender,
            password: form.values.password,
            role: form.values.role,
            brandId: brandId,
            wardId: isEmpty(form.values.ward) ? null : form.values.ward,
        };
        // console.log(addAccountParams)

        if (addAccountParams.role == RoleEnum.BrandManager && isEmpty(brandId)) {
            notifications.show({
                message: "A Brand is required for Brand Manager",
                color: "pale-red.5",
                withCloseButton: true,
            });
            return;
        }

        addAccount(addAccountParams, {
            onSuccess(data) {
                // console.log(data)
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

    useEffect(() => {
        const timer = setTimeout(() => refetchBrand(), 500);
        return () => { clearTimeout(timer); };
    }, [brand]);

    return (
        <form style={{ textAlign: "left" }} onSubmit={form.onSubmit(() => onSubmitForm())}>
            <Group grow mt={10}>
                <Select label="Role" placeholder="Select" withAsterisk
                    disabled={!isEmpty(initialBrandId)}
                    data={[
                        { value: RoleEnum.Technician, label: 'Technician' },
                        { value: RoleEnum.BrandManager, label: 'Brand Manager' },
                    ]}
                    {...form.getInputProps('role')} />
                <Select label="Brand (For Brand Manager)" data={brandList || []} limit={5}
                    disabled={form.values.role != RoleEnum.BrandManager || !isEmpty(initialBrandId)} withAsterisk={form.values.role == "BrandManager"}
                    nothingFoundMessage={brandList && "Not Found"}
                    value={brandId} searchValue={brand}
                    placeholder="Pick value" clearable searchable
                    onSearchChange={setBrand} onChange={setBrandId}
                />
            </Group>
            <TextInput mt={10}
                withAsterisk label="Full Name"
                placeholder="Nguyen Van A"
                {...form.getInputProps("name")} />
            <TextInput mt={10}
                withAsterisk label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")} />
            <Group grow mt={10}>
                <TextInput
                    withAsterisk label="Password"
                    placeholder="Password" type="password"
                    {...form.getInputProps("password")} />
                <TextInput
                    withAsterisk label="Confirm Password"
                    placeholder="Confirm Password" type="password"
                    {...form.getInputProps("confirmPassword")} />
            </Group>
            <Group grow mt={10}>
                <DateInput
                    withAsterisk label="Birthday"
                    placeholder="January 1, 2000"
                    maxDate={getDateFromSetYear(18)}
                    {...form.getInputProps('birthday')} />
                <TextInput
                    label="Phone" placeholder="Phone Number" withAsterisk
                    {...form.getInputProps("phone")} />
                <Select label="Gender" placeholder="Select" withAsterisk
                    data={[
                        // { value: '', label: 'Select' },
                        { value: Gender.Male, label: 'Male' },
                        { value: Gender.Female, label: 'Female' },
                    ]}
                    {...form.getInputProps('gender')} />
            </Group>
            <Group grow mt={10}>
                <Select label="Province" placeholder="Select"
                    data={provincesList || []}
                    // rightSection={isLoadingProvinces ? <Loader size="1rem" /> : null}
                    {...form.getInputProps('province')}
                    onChange={(value) => {
                        form.setFieldValue('province', value || "")
                        setDistrictSearch("");
                        setWardSearch("");
                    }}
                    searchable nothingFoundMessage="Not Found"
                />
                <Select label="District" placeholder="Select"
                    disabled={form.values.province == ""}
                    data={districtsList || []}
                    rightSection={form.values.province != "" || isFetchingDistricts ? <Loader size="1rem" /> : null}
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
                    data={wardsList || []}
                    rightSection={form.values.province != "" || districtSearch != "" || isFetchingWards ? <Loader size="1rem" /> : null}
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
