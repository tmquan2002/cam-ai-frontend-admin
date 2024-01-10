import styled from "./navbar.module.scss";
import { ActionIcon, Button, Group } from "@mantine/core";
import CustomBreadcrumb, {
  BreadcrumbItem,
} from "../breadcrumbs/CustomBreadcrumb";
import LightDarkSwitch from "../LightDarkSwirch";
import { useSession } from "../../context/AuthContext";
import { MdLogout } from "react-icons/md";

export const Navbar = ({ items }: { items: BreadcrumbItem[] }) => {

  const sessionHook = useSession();

  return (
    <div className={styled["container-main"]}>
      {/* <img src={Logo} alt="Logo" className={styled["logo"]} /> */}
      <CustomBreadcrumb items={items} />
      <Group>
        <LightDarkSwitch />
        <ActionIcon
          onClick={sessionHook?.signOut}
          variant="default" size="xl" aria-label="Logout"
        >
          <MdLogout style={{ width: 18, height: 18 }} />
        </ActionIcon>
      </Group>
    </div>
  );
};

export default Navbar;
