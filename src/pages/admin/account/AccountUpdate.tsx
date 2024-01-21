import { Text } from "@mantine/core";
import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import { UpdateAccountForm } from "./components/UpdateAccountForm";
import styled from "./styles/account.module.scss";
import { useParams } from "react-router-dom";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Account",
        link: "/account"
    },
    {
        title: "Update"
    }
]

const AccountUpdate = () => {

    const params = useParams();
    console.log(params);

    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} goBack />
            <div className={styled["table-container"]}>
                <Text size='lg' fw={'bold'} fz={25} p={10} c={"light-blue.4"}>UPDATE ACCOUNT</Text>
                <UpdateAccountForm id={params.accountId!} />
            </div>
        </div>
    );
};

export default AccountUpdate;
