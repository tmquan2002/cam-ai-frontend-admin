import { Button, Group, Loader, Select } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddEdgeBoxInstallParams } from "../../../../apis/EdgeBoxInstallAPI";
import { useInstallEdgeBox } from "../../../../hooks/useEdgeBoxInstalls";
import { useGetAllEdgeBoxesSelect } from "../../../../hooks/useEdgeBoxes";
import { useGetAllShopsInstallingSelect } from "../../../../hooks/useShops";
import { EdgeBoxLocationStatus, EdgeBoxStatus } from "../../../../types/enum";

interface AssignFormParams {
    shopId?: string;
    edgeBoxId?: string;
    close: () => void;
    refetch: () => {};
    refetchInstall: () => {};
}

export const ShopEdgeBoxAssignForm = ({ shopId, edgeBoxId, close, refetch, refetchInstall }: AssignFormParams) => {

    const [edgeBoxSearch, setEdgeBoxSearch] = useState<string>("");

    const { mutate: installEdgeBox, isLoading: isLoadingInstall } = useInstallEdgeBox();
    //Edge Box must not have installed on any shop
    const { data: edgeBoxList, isFetching: isFetchingEdgeBox, refetch: refetchSearchEdgeBox
    } = useGetAllEdgeBoxesSelect({ edgeBoxLocation: EdgeBoxLocationStatus.Idle, name: edgeBoxSearch, edgeBoxStatus: EdgeBoxStatus.Active })
    const { data: shopList, isFetching: isFetchingShop } = useGetAllShopsInstallingSelect({ q: false, filterRemoveInactive: true })

    useEffect(() => {
        const timer = setTimeout(() => refetchSearchEdgeBox(), 500);
        return () => { clearTimeout(timer); };
    }, [edgeBoxSearch])

    // useEffect(() => {
    //     const timer = setTimeout(() => refetchSearchShop(), 500);
    //     return () => { clearTimeout(timer); };
    // }, [shopSearch])

    const form = useForm({
        initialValues: {
            edgeBoxId: edgeBoxId ?? "",
            shopId: shopId ?? "",
        },

        validate: {
            edgeBoxId: isNotEmpty("Please choose an edge box"),
            shopId: isNotEmpty("Please choose a shop"),
        },
    });

    const onSubmitForm = async (values: AddEdgeBoxInstallParams) => {

        const installEdgeBoxParams: AddEdgeBoxInstallParams = {
            edgeBoxId: edgeBoxId ?? values.edgeBoxId,
            shopId: shopId ?? values.shopId,
        };

        // console.log(installEdgeBoxParams)

        installEdgeBox(installEdgeBoxParams, {
            onSuccess(data) {
                console.log(data)
                notifications.show({
                    title: "Successfully",
                    message: "Assign successful!",
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
                        message: error.response?.data.message || "Unknown error occured",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                } else {
                    // console.error(error);
                    notifications.show({
                        title: "Failed",
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
            <Select data={edgeBoxList ?? []} limit={5} size='sm' mb={10}
                label="Edge Box" clearable
                disabled={edgeBoxId ? true : false}
                nothingFoundMessage={edgeBoxList && "Not Found"}
                rightSection={isFetchingEdgeBox ? <Loader size="1rem" /> : null}
                placeholder="Pick value" searchable
                onSearchChange={setEdgeBoxSearch} searchValue={edgeBoxSearch}
                {...form.getInputProps("edgeBoxId")}
            />

            <Select data={shopList ?? []} size='sm'
                label="Shop" clearable
                disabled={shopId ? true : false}
                nothingFoundMessage={shopList && "Not Found"}
                rightSection={isFetchingShop ? <Loader size="1rem" /> : null}
                placeholder="Pick value" searchable
                {...form.getInputProps("shopId")}
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
                <Button
                    variant="outline" size="md" mt={20} onClick={close} loading={isLoadingInstall}
                    gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
                >
                    Cancel
                </Button>
            </Group>
        </form>
    );
};
