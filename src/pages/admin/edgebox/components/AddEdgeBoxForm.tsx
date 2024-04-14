import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { AddEdgeBoxParams } from "../../../../apis/EdgeBoxAPI";
import { useAddEdgeBox, useGetEdgeBoxModel } from "../../../../hooks/useEdgeBoxes";

export const AddEdgeBoxForm = ({ close, refetch }: { close: () => void, refetch: () => {} }) => {

    const { mutate: addEdgeBox, isLoading } = useAddEdgeBox();
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

    const onSubmitForm = async () => {
        // console.log(values)

        const addEdgeBoxParams: AddEdgeBoxParams = {
            name: form.values.name,
            edgeBoxModelId: form.values.edgeBoxModelId,
            serialNumber: form.values.serialNumber,
        };

        addEdgeBox(addEdgeBoxParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    title: "Successfully",
                    message: "Edge Box Added!",
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
                        title: "Failed",
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        title: "Failed",
                        message: "Something wrong happen trying to add a new edge box",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    return (
        <form
            onSubmit={form.onSubmit(() => onSubmitForm())}
            style={{ textAlign: "left" }}
        >
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Edge Box Name"
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
            <Select label="Model" data={edgeBoxModelList || []} limit={5} mt={10}
                withAsterisk error={false} size="md" allowDeselect={false}
                nothingFoundMessage={edgeBoxModelList && "Not Found"}
                disabled={edgeBoxModelLoading}
                rightSection={edgeBoxModelLoading ? <Loader size={16} /> : null}
                placeholder="Pick value"
                {...form.getInputProps("edgeBoxModelId")}
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
                    ADD
                </Button>
                <Button
                    variant="outline" size="md" mt={20} onClick={close}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    CANCEL
                </Button>
            </Group>
        </form>
    );
};
