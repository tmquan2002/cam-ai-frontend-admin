import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateAccountParams } from "../../../../apis/AccountAPI";
import { useGetAccountById, useUpdateAccount } from "../../../../hooks/useAccounts";
import { useGetDistricts, useGetProvinces, useGetWards } from "../../../../hooks/useLocation";
import { Gender } from "../../../../types/enum";
import { getDateFromSetYear, removeTime } from "../../../../utils/dateFormat";

export const UpdateAccountForm = ({ id }: { id: string }) => {
    const { data, isLoading: initialDataLoading } = useGetAccountById(id);

    // const [province, setProvince] = useState<string>(data?.ward?.district?.provinceId || "");
    // const [district, setDistrict] = useState<string>(data?.ward?.districtId || "");
    // const [ward, setWard] = useState<string>(data?.wardId || "");
    const form = useForm({
        initialValues: {
            email: "",
            name: "",
            gender: '',
            phone: "",
            birthday: new Date(2000, 0),
            addressLine: "",
            province: "",
            district: "",
            ward: "",
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
            gender: (value) =>
                value === '' ? "Please choose a gender" : null,
        },
    });

    const { mutate: updateAccount, isLoading } = useUpdateAccount();
    const { data: provinces, isLoading: isLoadingProvinces } = useGetProvinces();
    const { data: districts, isFetching: isFetchingDistricts } = useGetDistricts(form.values.province!);
    const { data: wards, isFetching: isFetchingWards } = useGetWards(form.values.district!);

    const navigate = useNavigate();



    useEffect(() => {
        if (data && isLoadingProvinces) {
            console.log(data)
            form.setValues({
                email: data?.email,
                name: data?.name,
                phone: data?.phone,
                addressLine: data?.addressLine,
                gender: data?.gender?.toString() == "Male" ? "0" : data?.gender?.toString() == "Female" ? "1" : "",
                birthday: new Date(data?.birthday),
                province: data?.ward?.district.province.id,
                district: data?.ward?.district.id,
                ward: data?.ward?.id
            });
            console.log(form.values)
        }
    }, [data, provinces]);

    const onSubmitForm = async () => {
        // console.log(values)

        const updateAccountParams: UpdateAccountParams = {
            id,
            values: {
                name: form.values.name,
                email: form.values.email,
                phone: form.values.phone,
                addressLine: form.values.addressLine,
                birthday: removeTime(new Date(form.values.birthday), "-"),
                gender: Number(form.values.gender),
                wardId: form.values.ward,
            }
        };
        console.log(updateAccountParams)

        updateAccount(updateAccountParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
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
                        message: "Something wrong happen trying to update this account",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    console.error(error);
                }
            },
        });
    };

    return (
        <>
            {initialDataLoading && isLoadingProvinces ? <Loader /> :
                <form style={{ textAlign: "left" }}>
                    <TextInput
                        withAsterisk label="Last Name"
                        placeholder="Last Name"
                        {...form.getInputProps("name")} />
                    <TextInput
                        withAsterisk label="Email"
                        placeholder="your@email.com"
                        {...form.getInputProps("email")} />
                    <Group grow>
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
                                { value: '', label: 'Select' },
                                { value: Gender.Male.toString(), label: 'Male' },
                                { value: Gender.Female.toString(), label: 'Female' },
                            ]}
                            {...form.getInputProps('gender')} />
                    </Group>
                    <Group grow>
                        <Select label="Province" placeholder="Select"
                            data={provinces ? provinces : []}
                            rightSection={isLoadingProvinces ? <Loader size="1rem" /> : null}
                            {...form.getInputProps('province')}
                            searchable limit={5} nothingFoundMessage="Not Found"
                        />
                        <Select label="District" placeholder="Select"
                            disabled={form.values.province ? false : true}
                            data={districts ? districts : []}
                            rightSection={isFetchingDistricts ? <Loader size="1rem" /> : null}
                            {...form.getInputProps('district')}
                            searchable limit={5} nothingFoundMessage="Not Found"
                        />
                        <Select label="Ward" placeholder="Select"
                            disabled={form.values.province && form.values.district ? false : true}
                            data={wards ? wards : []}
                            rightSection={isFetchingWards ? <Loader size="1rem" /> : null}
                            {...form.getInputProps('ward')}
                            searchable limit={5} nothingFoundMessage="Not Found"
                        />
                    </Group>
                    <TextInput
                        label="Address" placeholder="123/45 ABC..."
                        {...form.getInputProps("addressLine")} />
                    <Group
                        justify="flex-start"
                        mt="md"
                    >
                        <Button
                            loading={isLoading} onClick={onSubmitForm}
                            variant="gradient" size="md" mt={20}
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            Update
                        </Button>
                    </Group>
                </form>
            }
        </>
    );
};
