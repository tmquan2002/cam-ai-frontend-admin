import { Breadcrumbs, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import styled from './breadcrumb.module.scss';

export interface BreadcrumbItem {
    title: string;
    link?: string;
}

const CustomBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
    return (
        <Breadcrumbs>
            {items.map((item, index) => (
                !item.link ?
                    <Text key={index} className={styled.text}>
                        {item.title}
                    </Text>
                    :
                    <Link to={item.link} key={index} className={styled.link}>
                        {item.title}
                    </Link>
            ))}
        </Breadcrumbs>
    );
}

export default CustomBreadcrumb