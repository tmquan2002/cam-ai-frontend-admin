import styled from "./navbar.module.scss";
import { ActionIcon, Group, Indicator, Tooltip } from "@mantine/core";
import CustomBreadcrumb, {
  BreadcrumbItem,
} from "../breadcrumbs/CustomBreadcrumb";
import LightDarkSwitch from "../LightDarkSwirch";
import { useSession } from "../../context/AuthContext";
import { MdLogout, MdNotifications } from "react-icons/md";

export const Navbar = ({ items }: { items: BreadcrumbItem[] }) => {

  const sessionHook = useSession();

  return (
    <div className={styled["container-main"]}>
      {/* <img src={Logo} alt="Logo" className={styled["logo"]} /> */}
      <CustomBreadcrumb items={items} />
      <Group>
        <LightDarkSwitch />
        <Tooltip label="Notification" withArrow>
          <Indicator size={12} color="pale-red.6">
            <ActionIcon
              // onClick={sessionHook?.signOut}
              variant="default" size="xl" aria-label="Logout"
            >
              <MdNotifications style={{ width: 18, height: 18 }} />
            </ActionIcon>
          </Indicator>
        </Tooltip>
        <Tooltip label="Logout" withArrow>
          <ActionIcon
            onClick={sessionHook?.signOut}
            variant="default" size="xl" aria-label="Logout"
          >
            <MdLogout style={{ width: 18, height: 18 }} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </div>
  );
};

export default Navbar;
