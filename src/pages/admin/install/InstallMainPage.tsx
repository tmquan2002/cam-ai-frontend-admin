import InstallList from "./components/InstallList";
import styled from "./styles/edgeboxinstall.module.scss";

const InstallMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <div className={styled["table-container"]}>
                <InstallList />
            </div>
        </div>

    );
};

export default InstallMainPage;
