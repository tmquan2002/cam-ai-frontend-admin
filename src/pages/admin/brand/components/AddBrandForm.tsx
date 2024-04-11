import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddBrandParams } from "../../../../apis/BrandAPI";
import { useAddBrand } from "../../../../hooks/useBrands";
import { isEmpty } from "lodash";

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
                isEmpty(value) ? "Name is required" : null,
            email: (value: string) =>
                isEmpty(value) ? null
                    : /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "An email should have a name, @ sign, a server name and domain in order and no whitespace. Valid example abc@email.com",
            phone: (value: string) =>
                isEmpty(value) ? null :
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
                        ? null
                        : "A Phone number should have a length of 10-12 characters",
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
                // console.log(data)
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
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        message: "Something wrong happen trying to add a new brand",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    return (
        <form
            onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            style={{ textAlign: "left" }}
        >
            <TextInput mt={10}
                withAsterisk
                label="Name"
                placeholder="Brand Name"
                size="md"
                {...form.getInputProps("name")}
            />
            <TextInput mt={10}
                label="Email"
                placeholder="your@email.com"
                size="md"
                {...form.getInputProps("email")}
            />

            <TextInput mt={10}
                label="Phone"
                placeholder="Phone Number"
                size="md"
                {...form.getInputProps("phone")}
            />

            <Group
                justify="flex-start"
                mt={10}
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
