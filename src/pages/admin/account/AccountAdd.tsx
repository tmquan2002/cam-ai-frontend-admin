import { Text } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { AddAccountForm } from "./components/AddAccountForm";
import styled from "./styles/account.module.scss";

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

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>
                <Text size='lg' fw={'bold'} fz={25} p={10} c={"light-blue.4"}>NEW ACCOUNT</Text>
                <AddAccountForm />
            </div>
        </div>
    );
};

export default AccountAdd;
