import { AiFillControl, AiFillDashboard, AiFillShop, AiFillSnippets } from "react-icons/ai";
import { FaTicketAlt } from "react-icons/fa";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { LinksGroup } from './LinksGroup';
import styled from './sidebar.module.scss';
import { Divider, Text } from "@mantine/core";

const data = [
    { label: 'Dashboard', icon: AiFillDashboard, path: '/dashboard' },
    { label: 'Account', icon: MdOutlineSupervisorAccount, path: '/account' },
    { label: 'Brand', icon: AiFillSnippets, path: '/brand' },
    { label: 'Shop', icon: AiFillShop, path: '/shop' },
    { label: 'Edgebox', icon: AiFillControl, path: '/edgebox' },
    { label: 'Ticket', icon: FaTicketAlt, path: '/ticket' },
];

export function SideBar() {
    const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={styled.sidebar}>
            <Text m={10} fw={'bold'} size="lg">CAMAI</Text>
            <Divider />
            <div className={styled.linksInner}>{links}</div>
        </nav>
    );
}