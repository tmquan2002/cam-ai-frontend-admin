import { AiFillControl, AiFillDashboard, AiFillProfile, AiFillShop, AiFillSnippets } from "react-icons/ai";
import { FaTicketAlt } from "react-icons/fa";
import styled from './sidebar.module.scss';
import { LinksGroup } from './LinksGroup';

const data = [
    { label: 'Dashboard', icon: AiFillDashboard, path: '/dashboard' },
    { label: 'Account', icon: AiFillProfile, path: '/account' },
    { label: 'Brand', icon: AiFillSnippets, path: '/brand' },
    { label: 'Shop', icon: AiFillShop, path: '/shop' },
    { label: 'Edgebox', icon: AiFillControl, path: '/edgebox' },
    { label: 'Ticket', icon: FaTicketAlt, path: '/ticket' },
];

export function SideBar() {
    const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={styled.sidebar}>
            <div className={styled.linksInner}>{links}</div>
        </nav>
    );
}