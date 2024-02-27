import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddEdgeBoxParams } from "../../../../apis/EdgeBoxAPI";
import { useAddEdgeBox } from "../../../../hooks/useEdgeBoxes";

export const AddEdgeBoxForm = () => {

    const { mutate: addEdgeBox, isLoading } = useAddEdgeBox();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            model: "",
            username: "",
            password: "",
        },

        validate: {
            model: (value) =>
                value.trim().length === 0 ? "Model is required" : null,
            username: (value) =>
                value.trim().length === 0 ? "Username is required" : null,
            password: (value) =>
                value.trim().length === 0 ? "Password is required" : null,
        },
    });

    const onSubmitForm = async (values: AddEdgeBoxParams) => {
        // console.log(values)

        const addBrandParams: AddEdgeBoxParams = {
            model: values.model,
            username: values.username,
            password: values.password,
        };

        addEdgeBox(addBrandParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    message: "Added!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(`/edgebox/${data.id}`, { replace: true })
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
        <form
            onSubmit={form.onSubmit((values) => onSubmitForm(values))}
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
