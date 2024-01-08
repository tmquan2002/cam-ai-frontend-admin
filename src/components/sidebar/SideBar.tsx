import { AiFillHome } from "react-icons/ai";
import styled from './sidebar.module.scss';
import { LinksGroup } from './LinksGroup';

const data = [
    { label: 'Dashboard', icon: AiFillHome, path: '/dashboard' },
    { label: 'Manage Brand', icon: AiFillHome, path: '/brand' },
    {
        label: 'Manage Shop',
        icon: AiFillHome,
        initiallyOpened: true,
        links: [
            { label: 'Create Shop', path: '/' },
            { label: 'Read Shop', path: '/' },
            { label: 'Update Shop', path: '/' },
            { label: 'Delete Shop', path: '/' },
        ],
    },
];

export function SideBar() {
    const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={styled.sidebar}>
            <div className={styled.linksInner}>{links}</div>
        </nav>
    );
}