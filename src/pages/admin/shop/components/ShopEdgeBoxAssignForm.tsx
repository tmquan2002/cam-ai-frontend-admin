import { Button, Group, Loader, Select, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddEdgeBoxInstallParams } from "../../../../apis/EdgeBoxAPI";
import { ApiErrorResponse } from "../../../../hooks/useAuth";
import { useGetAllEdgeBoxesSelect, useInstallEdgeBox } from "../../../../hooks/useEdgeBoxes";
import { useForm } from "@mantine/form";

export const ShopEdgeBoxAssignForm = ({ shopId }: { shopId: string }) => {

    const { mutate: installEdgeBox, isLoading: isLoadingInstall } = useInstallEdgeBox();
    const navigate = useNavigate();
    const { data: edgeBoxList, isFetching, isLoading: isLoadingEdgeBoxSelect
    } = useGetAllEdgeBoxesSelect({})

    const form = useForm({
        initialValues: {
            edgeBoxId: "",
            shopId: shopId,
            port: 0,
            ipAddress: "",
        },

        validate: {
            edgeBoxId: (value) =>
                value.trim().length === 0 ? "Please choose an edge box" : null,
        },
    });

    const onSubmitForm = async (values: AddEdgeBoxInstallParams) => {

        const installEdgeBoxParams: AddEdgeBoxInstallParams = {
            edgeBoxId: values.edgeBoxId,
            shopId: shopId,
            ipAddress: values.ipAddress,
            port: values.port
        };

        console.log(values)

        installEdgeBox(installEdgeBoxParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    message: "Assign successful!",
                    color: "green",
                    withCloseButton: true,
                });
                navigate(`/shop/${shopId}`, { replace: true })
            },
            onError(error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data as ApiErrorResponse);
                    notifications.show({
                        message: error.response?.data.message,
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        message: "Something wrong happen trying to assign an edge box",
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
            style={{ textAlign: "left", marginTop: 10 }}
        >
            <Select data={edgeBoxList || []} limit={5} size='sm'
                label="Edge Box"
                nothingFoundMessage={edgeBoxList && "Not Found"}
                rightSection={(isLoadingEdgeBoxSelect || isFetching) ? <Loader size="1rem" /> : null}
                placeholder="Pick value"
                {...form.getInputProps("edgeBoxId")}
            />

            <TextInput mt={10}
                label="Ip Address"
                placeholder="Ip Address"
                size="sm"
                {...form.getInputProps("ipAddress")}
            />

            <TextInput mt={10}
                label="Port"
                placeholder="Port"
                type="number"
                size="sm"
                {...form.getInputProps("port")}
            />

            <Group
                justify="flex-start"
                mt={10}
            >
                <Button
                    loading={isLoadingInstall}
                    type="submit" variant="gradient" size="md" mt={20}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Assign
                </Button>
            </Group>
        </form>
    );
};
