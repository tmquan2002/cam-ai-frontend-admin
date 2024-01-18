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
        <>
            <Navbar items={breadcrumbs} goBackLink="/brand" />
            <div className={styled["table-container"]}>
                <Text size='lg' style={{ fontWeight: 'bold', fontSize: '25px' }} c={"light-blue.4"}>NEW ACCOUNT</Text>
                <AddAccountForm />
            </div>
        </>
    );
};

export default AccountAdd;
