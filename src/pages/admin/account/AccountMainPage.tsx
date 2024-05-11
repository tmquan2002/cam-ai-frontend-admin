import AccountList from "./components/AccountList";
import styled from "./styles/account.module.scss";

const AccountMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <div className={styled["table-container"]}>
                <AccountList />
            </div>
        </div>
    );
};

export default AccountMainPage;
