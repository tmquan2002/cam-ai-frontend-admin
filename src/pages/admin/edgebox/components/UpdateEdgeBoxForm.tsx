import { Button, Group, Loader, Select, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { UpdateEdgeBoxParams } from "../../../../apis/EdgeBoxAPI";
import { useGetEdgeBoxById, useGetEdgeBoxModel, useUpdateEdgeBox } from "../../../../hooks/useEdgeBoxes";

export const UpdateEdgeBoxForm = ({ id, close, refetch, refetchInstall }: { id: string, close: () => void, refetch: () => {}, refetchInstall: () => {} }) => {

    const { mutate: updateEdgeBox, isLoading } = useUpdateEdgeBox();
    const { data, isLoading: initialDataLoading, error } = useGetEdgeBoxById(id);
    const { data: edgeBoxModelList, isLoading: edgeBoxModelLoading } = useGetEdgeBoxModel();
    const [edgeBoxModelId, setEdgeBoxModelId] = useState<string | null>(data?.edgeBoxModelId || null);

    const form = useForm({
        initialValues: {
            model: ""
        },

        validate: {
            model: (value) =>
                value.trim().length === 0 ? "Model is required" : null
        },
    });

    useEffect(() => {
        if (data) {
            form.setValues({
                model: data?.name
            });
        }
    }, [data]);

    const onSubmitForm = async () => {
        // console.log(values)

        const updateBrandParams: UpdateEdgeBoxParams = {
            id: id,
            values: {
                name: form.values.model,
                edgeBoxModelId: edgeBoxModelId,
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
                refetchInstall();
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
                        message: "Something wrong happen trying to update this edge box",
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
                    {error ? <Text w={'100%'} c="dimmed" mt={20} ta="center">Edge Box not found</Text> :
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

                            <Select label="Edge Box Model" data={edgeBoxModelList || []} limit={5}
                                withAsterisk error={false} size="md" mt={20}
                                nothingFoundMessage={edgeBoxModelList && "Not Found"}
                                value={edgeBoxModelId} disabled={edgeBoxModelLoading}
                                rightSection={edgeBoxModelLoading ? <Loader size={16} /> : null}
                                placeholder="Pick value" onChange={setEdgeBoxModelId}
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
            }
        </>
    );
};
