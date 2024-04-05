import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { isEmpty } from "lodash";
import { useState } from "react";
import { AddEdgeBoxParams } from "../../../../apis/EdgeBoxAPI";
import { useAddEdgeBox, useGetEdgeBoxModel } from "../../../../hooks/useEdgeBoxes";

export const AddEdgeBoxForm = ({ close, refetch }: { close: () => void, refetch: () => {} }) => {

    const { mutate: addEdgeBox, isLoading } = useAddEdgeBox();
    const [edgeBoxModelId, setEdgeBoxModelId] = useState<string | null>(null);
    const { data: edgeBoxModelList, isLoading: edgeBoxModelLoading } = useGetEdgeBoxModel();

    const form = useForm({
        initialValues: {
            name: "",
            username: "",
            password: ""
        },

        validate: {
            name: (value) =>
                value.trim().length === 0 ? "Name is required" : null,
            username: (value) =>
                value.trim().length === 0 ? "Username is required" : null,
            password: (value) =>
                value.trim().length === 0 ? "Password is required" : null,
        },
    });

    const onSubmitForm = async () => {
        // console.log(values)

        const addEdgeBoxParams: AddEdgeBoxParams = {
            name: form.values.name,
            username: form.values.username,
            password: form.values.password,
            edgeBoxModelId: edgeBoxModelId,
        };

        if (isEmpty(edgeBoxModelId)) {
            notifications.show({
                message: "Please select a model",
                color: "pale-red.5",
                withCloseButton: true,
            });
            return;
        }

        addEdgeBox(addEdgeBoxParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
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
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        message: "Something wrong happen trying to add a new edge box",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
            },
        });
    };

    return (
        // TODO: Remove Username and Password field
        <form
            onSubmit={form.onSubmit(() => onSubmitForm())}
            style={{ textAlign: "left" }}
        >
            <Group grow mt={10}>
                <TextInput mt={10}
                    withAsterisk
                    label="Username"
                    placeholder="your@email.com"
                    size="md"
                    {...form.getInputProps("username")}
                />
                <TextInput mt={10}
                    withAsterisk
                    label="Password"
                    type="password"
                    placeholder="Password"
                    size="md"
                    {...form.getInputProps("password")}
                />
            </Group>

            <Group grow mt={20}>
                <TextInput
                    withAsterisk
                    label="Edge Box Name"
                    placeholder="Edge Box Name"
                    size="md"
                    {...form.getInputProps("name")}
                />
                <Select label="Edge Box Model" data={edgeBoxModelList || []} limit={5}
                    withAsterisk error={false} size="md" 
                    nothingFoundMessage={edgeBoxModelList && "Not Found"}
                    value={edgeBoxModelId} disabled={edgeBoxModelLoading}
                    rightSection={edgeBoxModelLoading ? <Loader size={16} /> : null}
                    placeholder="Pick value" onChange={setEdgeBoxModelId}
                />
            </Group>

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
