import BrandList from "./components/BrandList";
import styled from "./styles/brand.module.scss";

const BrandMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <div className={styled["table-container"]}>
                <BrandList />
            </div>
        </div>

    );
};

export default BrandMainPage;
