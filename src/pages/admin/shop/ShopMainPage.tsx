import ShopList from "./components/ShopList";
import styled from "./styles/shop.module.scss";

const ShopMainPage = () => {

    return (
        <div className={styled["container-detail"]}>
            <div className={styled["table-container"]}>
                <ShopList />
            </div>
        </div>

    );
};

export default ShopMainPage;
