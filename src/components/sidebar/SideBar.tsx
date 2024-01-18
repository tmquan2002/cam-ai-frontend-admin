import { AiFillDashboard, AiFillProfile, AiFillShop, AiFillSnippets } from "react-icons/ai";
import styled from './sidebar.module.scss';
import { LinksGroup } from './LinksGroup';

const data = [
    { label: 'Dashboard', icon: AiFillDashboard, path: '/dashboard' },
    { label: 'Accounts', icon: AiFillProfile, path: '/account' },
    { label: 'Brands', icon: AiFillSnippets, path: '/brand' },
    { label: 'Shops', icon: AiFillShop, path: '/shop' },
    // {
    //     label: 'Manage Shop',
    //     icon: AiFillShop,
    //     initiallyOpened: true,
    //     links: [
    //         { label: 'Create Shop', path: '/' },
    //         { label: 'Read Shop', path: '/' },
    //         { label: 'Update Shop', path: '/' },
    //         { label: 'Delete Shop', path: '/' },
    //     ],
    // },
];

export function SideBar() {
    const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={styled.sidebar}>
            <div className={styled.linksInner}>{links}</div>
        </nav>
    );
}