import { Divider, ScrollArea, Text } from "@mantine/core";
import { IconNotes, IconRouter } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AiFillShop } from "react-icons/ai";
import { GrInstall } from "react-icons/gr";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { WINDOW_BREAK_POINT } from "../../constants/WindowBreakPoint";
import { LinksGroup } from './LinksGroup';
import styled from './sidebar.module.scss';

const data = [
    { label: 'Account', icon: MdOutlineSupervisorAccount, path: '/account' },
    { label: 'Brand', icon: IconNotes, path: '/brand' },
    { label: 'Shop', icon: AiFillShop, path: '/shop' },
    { label: 'Edge Box', icon: IconRouter, path: '/edgebox' },
    { label: 'Edge Box Installation', icon: GrInstall, path: '/install' },
    { label: 'Report', icon: TbReport, path: '/report' },
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
            <ScrollArea className={windowWidth <= breakpoint ? styled["linksMinimize"] : styled["links"]}>
                <div className={styled["linksInner"]}>{links}</div>
            </ScrollArea>
        </nav>
    );
}