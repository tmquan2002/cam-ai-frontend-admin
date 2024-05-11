import { BreadcrumbItem } from "../../../components/breadcrumbs/CustomBreadcrumb";
import Navbar from "../../../components/navbar/Navbar";
import AccountList from "./components/AccountList";
import styled from "./styles/account.module.scss";

const breadcrumbs: BreadcrumbItem[] = []

const AccountMainPage = () => {
    return (
        <div className={styled["container-detail"]}>
            <Navbar items={breadcrumbs} />
            <div className={styled["table-container"]}>
                <AccountList />
            </div>
        </div>
    );
};

export default AccountMainPage;
