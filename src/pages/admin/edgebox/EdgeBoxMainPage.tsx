import EdgeBoxList from "./components/EdgeBoxList";
import styled from "./styles/edgebox.module.scss";

const EdgeBoxMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <div className={styled["table-container"]}>
                <EdgeBoxList />
            </div>
        </div>
    );
};

export default EdgeBoxMainPage;
