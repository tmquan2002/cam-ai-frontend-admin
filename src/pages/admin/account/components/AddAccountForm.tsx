import { Button, Group, MultiSelect, Select, TextInput } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { AddAccountParams } from "../../../../apis/AccountAPI";
import { getDateFromSetYear, removeTime } from "../../../../utils/dateFormat";

export const AddAccountForm = () => {

    // const { mutate: addAccount, isLoading } = useAddAccount();
    // const navigate = useNavigate();

    //TODO: Password should be auto generated, manager will have to change password later
    //TODO: Add selection for brand (Brand Manager) and working shop (Shop Manager)
    //TODO: Add ward selection
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            gender: '',
            phone: "",
            birthday: new Date(2000, 0),
            addressLine: "",
            roleIds: [],
        },

        validate: {
            firstName: (value: string) =>
                value.trim().length === 0 ? "First Name is required" : null,
            lastName: (value: string) =>
                value.trim().length === 0 ? "Last Name is required" : null,
            email: (value: string) =>
                value.trim().length === 0 ? "Email is required"
                    : /^\S+@\S+$/.test(value) ? null : "Invalid email",
            phone: (value: string) =>
                /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)
                    ? null
                    : "Invalid phone number",
            password: (value: string) =>
                value.trim().length === 0 ? "Password is required" : null,
            gender: (value) =>
                value === '' ? "Please choose a gender" : null,
            roleIds: (value) =>
                value.length === 0 ? "Please choose a role" : null,
        },
    });

    const onSubmitForm = async () => {
        // console.log(values)

        const addAccountParams: AddAccountParams = {
            name: form.values.firstName + form.values.lastName,
            email: form.values.email,
            phone: form.values.phone,
            addressLine: form.values.addressLine,
            birthday: removeTime(new Date(form.values.birthday), "-"),
            gender: Number(form.values.gender),
            password: form.values.password,
            roleIds: form.values.roleIds.map(str => Number(str)),
            brandId: null,
            wardId: null
        };
        console.log(addAccountParams)

        // addAccount(addAccountParams, {
        //     onSuccess(data) {
        //         console.log(data)
        //         notifications.show({
        //             message: "Added!",
        //             color: "green",
        //             withCloseButton: true,
        //         });
        //         navigate(`/account/${data.id}`)
        //     },
        //     onError(error) {
        //         if (axios.isAxiosError(error)) {
        //             // console.error(error.response?.data as ApiErrorResponse);
        //             notifications.show({
        //                 message: "Something wrong happen trying to add a new brand",
        //                 color: "pale-red.5",
        //                 withCloseButton: true,
        //             });
        //         } else {
        //             console.error(error);
        //         }
        //     },
        // });
    };

    return (
        <form
            onSubmit={form.onSubmit(() => onSubmitForm())}
            // onSubmit={form.onSubmit((values) => console.log(values))}
            style={{ textAlign: "left" }}
        >
            <Group grow>
                <TextInput
                    withAsterisk label="First Name"
                    placeholder="First Name"
                    {...form.getInputProps("firstname")} />
                <TextInput
                    withAsterisk label="Last Name"
                    placeholder="Last Name"
                    {...form.getInputProps("lastName")} />
            </Group>
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
                        { value: '0', label: 'Male' },
                        { value: '1', label: 'Female' },
                    ]}
                    {...form.getInputProps('gender')} />
            </Group>
            <TextInput
                label="Address" placeholder="123/45 ABC..."
                {...form.getInputProps("addressLine")} />
            <MultiSelect label="Role" placeholder="Select" withAsterisk
                data={[
                    { value: '2', label: 'Technician' },
                    { value: '3', label: 'Brand Manager' },
                    { value: '4', label: 'Shop Manager' },
                    { value: '5', label: 'Employee' },
                ]}
                {...form.getInputProps('roleIds')} />
            <Group
                justify="flex-start"
                mt="md"
            >
                <Button
                    // loading={isLoading}
                    type="submit" variant="gradient" size="md" mt={20}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Add
                </Button>
            </Group>
        </form>
    );
};
