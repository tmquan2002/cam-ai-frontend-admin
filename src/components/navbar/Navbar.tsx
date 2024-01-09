import styled from "./navbar.module.scss";
import { Group } from "@mantine/core";
import CustomBreadcrumb, { BreadcrumbItem } from "../breadcrumbs/CustomBreadcrumb";
import LightDarkSwitch from "../LightDarkSwirch";

export const Navbar = ({ items }: { items: BreadcrumbItem[] }) => {

    return (
        <div className={styled["container-main"]}>
            {/* <img src={Logo} alt="Logo" className={styled["logo"]} /> */}
            <CustomBreadcrumb items={items} />
            <Group>
                <LightDarkSwitch />
            </Group>
        </div>
    )
};

export default Navbar;