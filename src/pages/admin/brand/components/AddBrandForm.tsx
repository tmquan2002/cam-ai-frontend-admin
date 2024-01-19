import { TextInput, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { AddBrandParams } from "../../../../apis/BrandAPI";
import { useAddBrand } from "../../../../hooks/useBrands";
import { useNavigate } from "react-router-dom";

export const AddBrandForm = () => {

    const { mutate: addBrand, isLoading } = useAddBrand();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            phone: "",
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
        },
    });

    const onSubmitForm = async (values: AddBrandParams) => {
        // console.log(values)

        const addBrandParams: AddBrandParams = {
            name: values.name,
            email: values.email,
            phone: values.phone,
        };

        addBrand(addBrandParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    message: "Added!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(`/brand/${data.id}`, { replace: true })
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        message: "Something wrong happen trying to add a new brand",
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
        <form
            onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            style={{ textAlign: "left" }}
        >
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Brand Name"
                size="md"
                {...form.getInputProps("name")}
            />
            <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                size="md"
                {...form.getInputProps("email")}
            />

            <TextInput
                label="Phone"
                placeholder="Phone Number"
                size="md"
                {...form.getInputProps("phone")}
            />

            <Group
                justify="flex-start"
                mt="md"
            >
                <Button
                    loading={isLoading}
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
