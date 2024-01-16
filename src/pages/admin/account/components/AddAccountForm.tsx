import { TextInput, Button, Group, Select } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
// import axios from "axios";
// import { notifications } from "@mantine/notifications";
// import { AddBrandParams } from "../../../../apis/BrandAPI";
// import { useAddBrand } from "../../../../hooks/useBrands";
// import { useNavigate } from "react-router-dom";

export const AddAccountForm = () => {

    // const { mutate: addBrand, isLoading } = useAddBrand();
    // const navigate = useNavigate();

    //TODO: Password should be auto generated, manager will have to change password later
    //TODO: Add selection for brand (Brand Manager) and working shop (Shop Manager)
    //TODO: Add ward selection
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            name: "",
            gender: "",
            phone: "",
            birthday: "",
            address: "",
            role: "",
        },

        validate: {
            name: (value) =>
                value.trim().length === 0 ? "Name is required" : null,
            email: (value) =>
                value.trim().length === 0 ? "Email is required"
                    : /^\S+@\S+$/.test(value) ? null : "Invalid email",
            phone: (value) =>
                /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)
                    ? null
                    : "Invalid phone number",
            password: (value) =>
                value.trim().length === 0 ? "Password is required" : null,
            gender: (value) =>
                value.trim().length === 0 ? "Please choose a gender" : null,
            role: (value) =>
                value.trim().length === 0 ? "Please choose a role" : null,
        },
    });

    // const onSubmitForm = async (values: AddBrandParams) => {
    //     // console.log(values)

    //     const addBrandParams: AddBrandParams = {
    //         name: values.name,
    //         email: values.email,
    //         phone: values.phone,
    //     };

    //     addBrand(addBrandParams, {
    //         onSuccess(data) {
    //             console.log(data)
    //             notifications.show({
    //                 message: "Added!",
    //                 color: "green",
    //                 withCloseButton: true,
    //             });
    //             navigate(`/brand/${data.id}`)
    //         },
    //         onError(error) {
    //             if (axios.isAxiosError(error)) {
    //                 // console.error(error.response?.data as ApiErrorResponse);
    //                 notifications.show({
    //                     message: "Something wrong happen trying to add a new brand",
    //                     color: "pale-red.5",
    //                     withCloseButton: true,
    //                 });
    //             } else {
    //                 console.error(error);
    //             }
    //         },
    //     });
    // };

    return (
        <form
            // onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            onSubmit={form.onSubmit((values) => console.log(values))}
            style={{ textAlign: "left" }}
        >
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Brand Name"
                size="md"
                {...form.getInputProps("name")} />
            <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                size="md"
                {...form.getInputProps("email")} />
            <TextInput
                withAsterisk
                label="Password"
                placeholder="Password"
                type="password"
                size="md"
                {...form.getInputProps("password")} />
            <TextInput
                label="Phone"
                placeholder="Phone Number"
                size="md"
                {...form.getInputProps("phone")} />
            <Select label="Gender" placeholder="Select" withAsterisk
                data={[
                    { value: '', label: 'Select' },
                    { value: '0', label: 'Male' },
                    { value: '1', label: 'Female' },
                ]}
                {...form.getInputProps('gender')} />
            <TextInput
                label="Address"
                placeholder="123/45 ABC..."
                size="md"
                {...form.getInputProps("address")} />
            <Select label="Role" placeholder="Select" withAsterisk
                data={[
                    { value: '', label: 'Select' },
                    { value: '1', label: 'Admin' },
                    { value: '2', label: 'Technician' },
                    { value: '3', label: 'Brand Manager' },
                    { value: '4', label: 'Shop Manager' },
                    { value: '5', label: 'Employee' },
                ]}
                {...form.getInputProps('role')} />
            <DateInput
                label="Birthday"
                placeholder="January 1, 2000"
                {...form.getInputProps('birthday')} />

            <Group
                justify="flex-start"
                mt="md"
            >
                <Button
                    // loading={isLoading}
                    type="submit"
                    variant="gradient"
                    size="md"
                    mt={20}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Add
                </Button>
            </Group>
        </form>
    );
};
