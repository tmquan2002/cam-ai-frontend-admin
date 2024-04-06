import { Divider, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiFillControl, AiFillDashboard, AiFillShop, AiFillSnippets } from "react-icons/ai";
import { GrInstall } from "react-icons/gr";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { WINDOW_BREAK_POINT } from "../../constants/WindowBreakPoint";
import { LinksGroup } from './LinksGroup';
import styled from './sidebar.module.scss';

const data = [
    { label: 'Dashboard', icon: AiFillDashboard, path: '/dashboard' },
    { label: 'Account', icon: MdOutlineSupervisorAccount, path: '/account' },
    { label: 'Brand', icon: AiFillSnippets, path: '/brand' },
    { label: 'Shop', icon: AiFillShop, path: '/shop' },
    { label: 'Edge Box', icon: AiFillControl, path: '/edgebox' },
    { label: 'Installs', icon: GrInstall , path: '/install', disabled: true },
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
        <nav className={styled["sidebar"]}>
            {windowWidth <= breakpoint ?
                <Text m={20} fw={'bold'} size={'25px'}>C</Text> :
                <Text m={20} fw={'bold'} size={'25px'}>CAMAI</Text>
            }
            <Divider />
            <div className={styled.linksInner}>{links}</div>
        </nav>
    );
}