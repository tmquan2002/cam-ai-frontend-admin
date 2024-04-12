import { TextInput, Button, Group, Loader, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { AddBrandParams, UpdateBrandParams } from "../../../../apis/BrandAPI";
import { useGetBrandById, useUpdateBrand } from "../../../../hooks/useBrands";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";

export const UpdateBrandForm = ({ id }: { id: string }) => {

    const { mutate: updateBrand, isLoading } = useUpdateBrand();
    const { data, isLoading: initialDataLoading, error } = useGetBrandById(id);
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
                    : /^\S+@(\S+\.)+\S{2,4}$/g.test(value) ? null : "Invalid email - ex: huy@gmail.com",
            phone: (value: string) =>
                isEmpty(value) ? null :
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(value)
                        ? null
                        : "A phone number should have a length of 10-12 characters",
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
                    title: "Successfully",
                    message: "Update brand successful!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(-1)
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
                        message: "Something wrong happen trying to update this brand",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    return (
        <>
            {initialDataLoading ? <Loader /> :
                <>
                    {error ? <Text w={'100%'} c="dimmed" mt={20} ta="center">Brand not found</Text> :
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
                                    Update
                                </Button>
                            </Group>
                        </form>
                    }
                </>
            }
        </>
    );
};
