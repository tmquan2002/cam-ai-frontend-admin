import { Text } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { AddAccountForm } from "./components/AddAccountForm";
import styled from "./styles/account.module.scss";
import { useLocation } from "react-router-dom";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Account",
        link: "/account"
    },
    {
        title: "Add"
    }
]

const AccountAdd = () => {
    const location = useLocation();

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>
                <Text size='lg' fw={'bold'} fz={25} p={10} c={"light-blue.4"}>NEW ACCOUNT</Text>
                <AddAccountForm initialBrandId={location?.state?.brandId} initialBrandName={location?.state?.name} />
            </div>
        </div>
    );
};

export default AccountAdd;
