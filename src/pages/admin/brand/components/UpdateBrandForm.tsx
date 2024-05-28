import { Box, Button, Divider, Group, Loader, Select, Text, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateBrandParams } from "../../../../apis/BrandAPI";
import { CustomModal } from "../../../../components/modal/CustomSimleModel";
import { useDeleteBrand, useGetBrandById, useReactivateBrand, useUpdateBrand } from "../../../../hooks/useBrands";
import { useGetDistricts, useGetProvinces, useGetWards } from "../../../../hooks/useLocation";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../../types/constant";
import { BrandStatus } from "../../../../types/enum";

type UpdateBrandFieldValue = {
    email: string | null;
    name: string | null;
    phone: string | null;
    brandWebsite: string | null;
    description: string | null;
    companyName: string | null;
    companyAddress: string | null;
    province: string | null;
    district: string | null;
    ward: string | null;
};

export const UpdateBrandForm = ({ id }: { id: string }) => {

    const [modalOpen, { open, close }] = useDisclosure(false);
    const { mutate: deleteBrand, isLoading: isLoadingDelete } = useDeleteBrand();
    const { mutate: reactivateBrand, isLoading: isLoadingReactivate } = useReactivateBrand();

    const form = useForm<UpdateBrandFieldValue>({
        initialValues: {
            name: null,
            email: null,
            phone: null,
            brandWebsite: null,
            description: null,
            province: null,
            district: null,
            ward: null,
            companyAddress: null,
            companyName: null,
        },

        validate: {
            name: isNotEmpty("Brand name is required"),
            email: (value) => isEmpty(value) || value == null ? null
                : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
            phone: (value) => isEmpty(value) || value == null ? null :
                PHONE_REGEX.test(value) ? null : "A phone number should have a length of 10-12 characters",
            companyName: isNotEmpty("Company name is required"),
            province: isNotEmpty("Please select a province"),
            district: isNotEmpty("Please select a district"),
            ward: isNotEmpty("Please select a ward"),
            companyAddress: isNotEmpty("Company address is required"),
        },
    });

    const { mutate: updateBrand, isLoading } = useUpdateBrand();
    const { data, isLoading: initialDataLoading, error } = useGetBrandById(id);
    const { data: provinceList, isLoading: isLoadingProvinces } = useGetProvinces();
    const { data: districtList, isFetching: isFetchingDistricts } = useGetDistricts(form.values.province);
    const { data: wardList, isFetching: isFetchingWards } = useGetWards(form.values.district);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            form.initialize({
                email: data?.email,
                name: data?.name,
                phone: data?.phone,
                brandWebsite: data?.brandWebsite,
                description: data?.description,
                province: data?.companyWard?.district?.province?.id.toString() ?? null,
                district: data?.companyWard?.district?.id.toString() ?? null,
                ward: data?.companyWard?.id.toString() ?? null,
                companyAddress: data?.companyAddress ?? null,
                companyName: data?.companyName ?? null,
            });
        }
    }, [data]);

    const onSubmitForm = async () => {
        // console.log(values)

        const updateBrandParams: UpdateBrandParams = {
            id: id,
            values: {
                name: form.values.name,
                email: isEmpty(form.values.email) ? null : form.values.email,
                phone: isEmpty(form.values.phone) ? null : form.values.phone,
                description: form.values.description,
                companyAddress: form.values.companyAddress,
                brandWebsite: form.values.brandWebsite,
                companyName: form.values.companyName,
                companyWardId: form.values.ward,
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

    const onDelete = () => {
        deleteBrand(id, {
            onSuccess() {
                navigate('/brand')
                notifications.show({
                    title: "Successfully",
                    message: "Brand disabled!",
                    color: "green",
                    withCloseButton: true,
                });
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
                    console.error(error);
                    notifications.show({
                        title: "Failed",
                        message: "Something wrong happen when trying to remove this brand",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                close();
            },
        });
    }

    const onReactivate = () => {
        reactivateBrand(id, {
            onSuccess() {
                navigate('/brand')
                notifications.show({
                    title: "Successfully",
                    message: "Brand Reactivated!",
                    color: "green",
                    withCloseButton: true,
                });
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
                    console.error(error);
                    notifications.show({
                        title: "Failed",
                        message: "Something wrong happen when trying to reactivate this brand",
                        color: "pale-red.5",
                        withCloseButton: true,
                    });
                }
                close();
            },
        });
    }

    return (
        <>
            {(initialDataLoading || isLoadingProvinces) ? <Loader /> :
                <>
                    {error ? <Text w={'100%'} c="dimmed" mt={20} ta="center">Brand not found</Text> :
                        <>
                            <Group justify="space-between">
                                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>Brand Settings</Text>
                                {data?.brandStatus == BrandStatus.Active ?
                                    <Button
                                        onClick={open} variant="filled"
                                        color="pale-red.4" size="sm"
                                    >
                                        Delete
                                    </Button>
                                    :
                                    <Button
                                        onClick={open} variant="filled"
                                    >
                                        Delete
                                    </Button>
                                }
                            </Group>
                            <form onSubmit={form.onSubmit(() => onSubmitForm())}>
                                <Group justify="space-between" align="baseline">
                                    <Box w={"45%"}>
                                        <Text fz={15} mt={20} fw={"bold"}>General Information</Text>
                                        <Divider />
                                        <TextInput mt={10}
                                            withAsterisk
                                            label="Brand Name"
                                            placeholder="Brand Name"
                                            {...form.getInputProps("name")}
                                        />
                                        <Group grow align="baseline">
                                            <TextInput mt={10}
                                                label="Email"
                                                placeholder="your@email.com"
                                                {...form.getInputProps("email")}
                                            />
                                            <TextInput mt={10}
                                                label="Phone"
                                                placeholder="Phone Number"
                                                {...form.getInputProps("phone")}
                                            />
                                        </Group>
                                        <TextInput mt={10}
                                            label="Website"
                                            placeholder="www.example.com"
                                            {...form.getInputProps("brandWebsite")}
                                        />
                                        <Textarea mt={10}
                                            label="Description" resize="vertical" minRows={2}
                                            placeholder="Something about this brand..."
                                            {...form.getInputProps("description")}
                                        />
                                    </Box>

                                    <Divider orientation="vertical" ml={5} mr={5} />

                                    <Box w={"45%"}>
                                        <Text fz={15} mt={20} fw={"bold"}>Company</Text>
                                        <Divider />
                                        <TextInput mt={10}
                                            withAsterisk
                                            label="Company Name"
                                            placeholder="Company Name"
                                            {...form.getInputProps("companyName")}
                                        />
                                        <Group grow mt={10} align="baseline">
                                            <Select label="Province" placeholder="Select"
                                                withAsterisk
                                                data={provinceList ?? []}
                                                // rightSection={isLoadingProvinces ? <Loader size="1rem" /> : null}
                                                {...form.getInputProps('province')}
                                                onChange={(value) => {
                                                    form.setFieldValue('province', value ?? null)
                                                    form.setFieldValue('district', null)
                                                    form.setFieldValue('ward', null)
                                                }}
                                                searchable clearable nothingFoundMessage="Not Found"
                                            />
                                            <Select label="District" placeholder="Select"
                                                withAsterisk
                                                disabled={form.values.province == null}
                                                data={districtList ?? []}
                                                rightSection={isFetchingDistricts ? <Loader size="1rem" /> : null}
                                                {...form.getInputProps('district')}
                                                onChange={(value) => {
                                                    form.setFieldValue('district', value ?? null)
                                                    form.setFieldValue('ward', null)
                                                }}
                                                searchable clearable nothingFoundMessage="Not Found"
                                            />
                                            <Select label="Ward" placeholder="Select"
                                                withAsterisk
                                                disabled={form.values.province == null || form.values.district == null}
                                                data={wardList ?? []}
                                                rightSection={isFetchingWards ? <Loader size="1rem" /> : null}
                                                {...form.getInputProps('ward')}
                                                searchable nothingFoundMessage="Not Found"
                                            />
                                        </Group>
                                        <TextInput mt={10}
                                            withAsterisk
                                            label="Address" placeholder="123/45 ABC..."
                                            {...form.getInputProps("companyAddress")}
                                        />
                                    </Box>

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
                                        Update
                                    </Button>
                                    <Button loading={isLoading} variant="outline" size="md" mt={20} color="pale-red.9"
                                        onClick={() => {
                                            form.setValues({
                                                email: data?.email ?? null,
                                                name: data?.name ?? null,
                                                phone: data?.phone ?? null,
                                                brandWebsite: data?.brandWebsite ?? null,
                                                description: data?.description ?? null,
                                                province: data?.companyWard?.district?.province?.id.toString() ?? null,
                                                district: data?.companyWard?.district?.id.toString() ?? null,
                                                ward: data?.companyWard?.id.toString() ?? null,
                                                companyAddress: data?.companyAddress ?? "",
                                                companyName: data?.companyName ?? "",
                                            })
                                        }}>
                                        Reset
                                    </Button>
                                </Group>
                            </form>
                            {/* Delete Modal */}
                            {data?.brandStatus === BrandStatus.Active ?
                                <CustomModal cancelLabel="Cancel" onClickAction={onDelete} onClose={close} opened={modalOpen} label="Delete" topTitle="Delete Brand"
                                    title="Do you want to remove this brand?" centered loading={isLoadingDelete} />
                                :
                                <CustomModal cancelLabel="Cancel" onClickAction={onReactivate} onClose={close} opened={modalOpen} label="Reactivate" topTitle="Reactivate Brand"
                                    title="Do you want to reactivate this brand?" centered loading={isLoadingReactivate} blueModal />
                            }
                        </>
                    }
                </>
            }
        </>
    );
};
