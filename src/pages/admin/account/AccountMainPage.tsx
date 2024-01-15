import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import AccountList from "./components/AccountList";
import styled from "./styles/account.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Account",
    },
]

const AccountMainPage = () => {

    return (
        <>
            <Navbar items={breadcrumbs} goBackLink="/dashboard" />
            <div className={styled["table-container"]}>
                <AccountList />
            </div>
        </>
    );
};

export default AccountMainPage;
