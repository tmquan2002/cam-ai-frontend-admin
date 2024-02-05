import { Box, LoadingOverlay, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { useGetEdgeBoxById } from "../../../hooks/useEdgeBoxes";
import styled from "./styles/edgeboxdetail.module.scss";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Edge Box",
        link: "/edgebox"
    },
    {
        title: "Detail"
    }
]

const EdgeBoxDetail = () => {

    const params = useParams();

    const { isLoading } = useGetEdgeBoxById(params.edgeBoxId!);

    return (
        <div className={styled["container-right"]}>
            <Navbar items={breadcrumbs} goBack />
            {isLoading ?
                <Box className={styled["loader"]}>
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                </Box> :
                <div className={styled["container-detail"]}>
                    <Text>Nothing here yet</Text>
                </div>
            }
        </div>
    );
};

export default EdgeBoxDetail;
