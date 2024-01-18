import { TextInput, Button, Group, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { AddBrandParams, UpdateBrandParams } from "../../../../apis/BrandAPI";
import { useGetBrandById, useUpdateBrand } from "../../../../hooks/useBrands";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UpdateBrandForm = ({ id }: { id: string }) => {

    const { mutate: updateBrand, isLoading } = useUpdateBrand();
    const {
        data,
        isLoading: initialDataLoading
    } = useGetBrandById(id);
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

    useEffect(() => {
        if (data) {
            form.setValues({
                email: data?.email,
                name: data?.name,
                phone: data?.phone,
            });
        }
    }, [data]);

    const onSubmitForm = async (values: AddBrandParams) => {
        // console.log(values)

        const updateBrandParams: UpdateBrandParams = {
            id: id,
            values: {
                name: values.name,
                email: values.email,
                phone: values.phone,
            }
        };

        updateBrand(updateBrandParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    message: "Update successful!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(`/brand/${id}`)
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    // console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        message: "Something wrong happen trying to update this brand",
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
            {initialDataLoading ? <Loader /> : <form
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
                        Update
                    </Button>
                </Group>
            </form>
            }
        </>
    );
};
