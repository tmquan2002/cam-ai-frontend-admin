import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { MdLogout } from "react-icons/md";
import { useSession } from "../../context/AuthContext";
import LightDarkSwitch from "../button/LightDarkSwitch";
import { NotificationButton } from "../button/NotificationButton";
import CustomBreadcrumb, {
  BreadCrumbParams
} from "../breadcrumbs/CustomBreadcrumb";
import styled from "./navbar.module.scss";

export const Navbar = ({ items, goBack }: BreadCrumbParams) => {

  const sessionHook = useSession();

  return (
    <div className={styled["container-main"]}>
      {/* <img src={Logo} alt="Logo" className={styled["logo"]} /> */}
      <CustomBreadcrumb items={items} goBack={goBack} />
      <Group gap={5}>
        <LightDarkSwitch size="md" />
        <NotificationButton />
        <Tooltip label="Logout" withArrow>
          <ActionIcon
            onClick={sessionHook?.signOut}
            variant="default" size="md" aria-label="Logout"
          >
            <MdLogout style={{ width: 18, height: 18 }} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </div>
  );
};

export default Navbar;
