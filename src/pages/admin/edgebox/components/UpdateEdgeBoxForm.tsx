import { Button, Group, Loader, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect } from "react";
import { UpdateEdgeBoxParams } from "../../../../apis/EdgeBoxAPI";
import { useGetEdgeBoxById, useUpdateEdgeBox } from "../../../../hooks/useEdgeBoxes";

export const UpdateEdgeBoxForm = ({ id, close, refetch }: { id: string, close: () => void, refetch: () => {} }) => {

    const { mutate: updateEdgeBox, isLoading } = useUpdateEdgeBox();
    const { data, isLoading: initialDataLoading } = useGetEdgeBoxById(id);

    const form = useForm({
        initialValues: {
            model: "",
            edgeBoxModelId: ","
        },

        validate: {
            model: (value) =>
                value.trim().length === 0 ? "Model is required" : null,
            edgeBoxModelId: (value) =>
                value.trim().length === 0 ? "Edge Box Model ID is required" : null,
        },
    });

    useEffect(() => {
        if (data) {
            form.setValues({
                model: data?.name,
                edgeBoxModelId: data?.edgeBoxModelId
            });
        }
    }, [data]);

    const onSubmitForm = async () => {
        // console.log(values)

        const updateBrandParams: UpdateEdgeBoxParams = {
            id: id,
            values: {
                name: form.values.model,
                edgeBoxModelId: form.values.edgeBoxModelId,
            }
        };

        updateEdgeBox(updateBrandParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    message: "Update successful!",
                    color: "green",
                    withCloseButton: true,
                });
                close();
                refetch();
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
                <form
                    onSubmit={form.onSubmit(() => onSubmitForm())}
                    style={{ textAlign: "left" }}
                >
                    <TextInput mt={10}
                        withAsterisk
                        label="Model"
                        placeholder="Model"
                        size="md"
                        {...form.getInputProps("model")}
                    />

                    <TextInput mt={10}
                        withAsterisk
                        label="Edge Box Model ID"
                        placeholder="Model ID"
                        size="md"
                        {...form.getInputProps("edgeBoxModelId")}
                    />

                    <Group
                        justify="flex-start"
                        mt={10}
                        align="end"
                    >
                        <Button
                            variant="outline" size="md" mt={20} onClick={close}
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            CANCEL
                        </Button>
                        <Button
                            loading={isLoading}
                            type="submit"
                            variant="gradient"
                            size="md"
                            mt={20}
                            gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                        >
                            UPDATE
                        </Button>
                    </Group>
                </form>
            }
        </>
    );
};
