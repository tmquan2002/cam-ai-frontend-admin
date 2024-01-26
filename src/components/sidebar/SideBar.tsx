import { AiFillControl, AiFillDashboard, AiFillShop, AiFillSnippets } from "react-icons/ai";
import { FaTicketAlt } from "react-icons/fa";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { LinksGroup } from './LinksGroup';
import styled from './sidebar.module.scss';
import { Divider, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { WINDOW_BREAK_POINT } from "../../constants/WindowBreakPoint";

const data = [
    { label: 'Dashboard', icon: AiFillDashboard, path: '/dashboard' },
    { label: 'Account', icon: MdOutlineSupervisorAccount, path: '/account' },
    { label: 'Brand', icon: AiFillSnippets, path: '/brand' },
    { label: 'Shop', icon: AiFillShop, path: '/shop' },
    { label: 'Edgebox', icon: AiFillControl, path: '/edgebox' },
    { label: 'Ticket', icon: FaTicketAlt, path: '/ticket' },
];

export function SideBar() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Add a listener for window resize events
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const breakpoint = WINDOW_BREAK_POINT;
    const links = data.map((item) => <LinksGroup {...item} key={item.label} minimize={windowWidth <= breakpoint} />);

    return (
        <nav className={windowWidth <= breakpoint ? styled["sidebar-minimize"] : styled["sidebar"]}>
            {windowWidth <= breakpoint ?
                <Text m={10} fw={'bold'} size="lg">C</Text> :
                <Text m={10} fw={'bold'} size="lg">CAMAI</Text>
            }
            <Divider />
            <div className={styled.linksInner}>{links}</div>
        </nav>
    );
}