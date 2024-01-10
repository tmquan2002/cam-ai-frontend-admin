import styled from "./navbar.module.scss";
import { Button, Group } from "@mantine/core";
import CustomBreadcrumb, {
  BreadcrumbItem,
} from "../breadcrumbs/CustomBreadcrumb";
import LightDarkSwitch from "../LightDarkSwirch";
import { useSession } from "../../context/AuthContext";

export const Navbar = ({ items }: { items: BreadcrumbItem[] }) => {
  const sessionHook = useSession();
  return (
    <div className={styled["container-main"]}>
      {/* <img src={Logo} alt="Logo" className={styled["logo"]} /> */}
      <CustomBreadcrumb items={items} />
      <Group>
        <LightDarkSwitch />
        <Button
          variant="filled"
          onClick={sessionHook?.signOut}
        >
          Logout
        </Button>
        ;
      </Group>
    </div>
  );
};

export default Navbar;
