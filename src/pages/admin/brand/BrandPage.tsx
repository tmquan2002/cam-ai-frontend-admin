import { SideBar } from "../../../components/sidebar/SideBar";
import BrandList from "./components/BrandList";
import styled from "./styles/brand.module.scss";
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const BrandPage = () => {

    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <div className={styled["container-main"]}>
            <SideBar />
            <div className={styled["container-detail"]}>
                <ActionIcon
                    onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                    variant="default"
                    size="xl"
                    aria-label="Toggle color scheme"
                >
                    {computedColorScheme === "dark" ? (
                        <MdLightMode style={{ width: 18, height: 18 }} />
                    ) : (
                        <MdDarkMode style={{ width: 18, height: 18 }} />
                    )}
                </ActionIcon>
                <div className={styled["table-container"]}>
                    <BrandList />
                </div>
            </div>
        </div>
    );
};

export default BrandPage;
