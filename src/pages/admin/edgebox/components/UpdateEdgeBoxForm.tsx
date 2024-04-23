import { Button, Group, Loader, Select, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect } from "react";
import { UpdateEdgeBoxParams } from "../../../../apis/EdgeBoxAPI";
import { useGetEdgeBoxById, useGetEdgeBoxModel, useUpdateEdgeBox } from "../../../../hooks/useEdgeBoxes";

export const UpdateEdgeBoxForm = ({ id, close, refetch, refetchInstall }: { id: string, close: () => void, refetch: () => {}, refetchInstall: () => {} }) => {

    const { mutate: updateEdgeBox, isLoading } = useUpdateEdgeBox();
    const { data, isLoading: initialDataLoading, error } = useGetEdgeBoxById(id);
    const { data: edgeBoxModelList, isLoading: edgeBoxModelLoading } = useGetEdgeBoxModel();

    const form = useForm({
        initialValues: {
            name: "",
            edgeBoxModelId: "",
            serialNumber: "",
        },

        validate: {
            name: isNotEmpty("Name is required"),
            serialNumber: isNotEmpty("Serail number is required"),
            edgeBoxModelId: isNotEmpty("Please select a model"),
        },
    });

    useEffect(() => {
        if (data) {
            form.setValues({
                name: data?.name,
                edgeBoxModelId: data?.edgeBoxModelId,
                serialNumber: data?.serialNumber,
            });
        }
    }, [data]);

    const onSubmitForm = async () => {
        // console.log(values)

        const updateBrandParams: UpdateEdgeBoxParams = {
            id: id,
            values: {
                name: form.values.name,
                edgeBoxModelId: form.values.edgeBoxModelId,
                serialNumber: form.values.serialNumber,
            }
        };

        updateEdgeBox(updateBrandParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    title: "Successfully",
                    message: "Update edge box successful!",
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
                        title: "Failed",
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        title: "Failed",
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
                                label="Name"
                                placeholder="Name"
                                size="md"
                                {...form.getInputProps("name")}
                            />

                            <TextInput
                                mt={10}
                                withAsterisk
                                label="Serial Number"
                                placeholder="Serial Number"
                                size="md"
                                {...form.getInputProps("serialNumber")}
                            />

                            <Select label="Edge Box Model" data={edgeBoxModelList || []} limit={5}
                                withAsterisk error={false} size="md" mt={20} allowDeselect={false}
                                nothingFoundMessage={edgeBoxModelList && "Not Found"}
                                disabled={edgeBoxModelLoading} rightSection={edgeBoxModelLoading ? <Loader size={16} /> : null}
                                placeholder="Pick value"
                                {...form.getInputProps("edgeBoxModelId")}
                            />

                            <Group
                                justify="flex-start"
                                mt={10}
                                align="end"
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
                                <Button
                                    variant="outline" size="md" mt={20} onClick={close} loading={isLoading}
                                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                                >
                                    Cancel
                                </Button>
                            </Group>
                        </form>
                    }
                </>
            }
        </>
    );
};
