import { Button, Group, Loader, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { AddEdgeBoxInstallParams } from "../../../../apis/EdgeBoxAPI";
import { useGetAllEdgeBoxesSelect, useInstallEdgeBox } from "../../../../hooks/useEdgeBoxes";
import { EdgeBoxLocationStatus } from "../../../../types/enum";
import { isEmpty } from "lodash";

export const ShopEdgeBoxAssignForm = ({ shopId, close, refetch }: { shopId: string, close: () => void, refetch: () => {} }) => {

    const { mutate: installEdgeBox, isLoading: isLoadingInstall } = useInstallEdgeBox();
    const { data: edgeBoxList, isFetching, isLoading: isLoadingEdgeBoxSelect
    } = useGetAllEdgeBoxesSelect({ edgeBoxLocation: EdgeBoxLocationStatus.Idle })

    const form = useForm({
        initialValues: {
            edgeBoxId: "",
            shopId: shopId,
        },

        validate: {
            edgeBoxId: (value) =>
                isEmpty(value) ? "Please choose an edge box" : null,
        },
    });

    const onSubmitForm = async (values: AddEdgeBoxInstallParams) => {

        const installEdgeBoxParams: AddEdgeBoxInstallParams = {
            edgeBoxId: values.edgeBoxId,
            shopId: shopId,
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
            style={{ textAlign: "left", marginTop: 5 }}
        >
            <Select data={edgeBoxList || []} limit={5} size='sm'
                label="Edge Box" allowDeselect={false}
                nothingFoundMessage={edgeBoxList && "Not Found"}
                rightSection={(isLoadingEdgeBoxSelect || isFetching) ? <Loader size="1rem" /> : null}
                placeholder="Pick value"
                {...form.getInputProps("edgeBoxId")}
            />

            <Group
                justify="flex-start"
                mt={5}
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
