import { Breadcrumbs, Group, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import styled from './breadcrumb.module.scss';

export interface BreadcrumbItem {
    title: string;
    link?: string;
}

export interface BreadCrumbParams {
    items: BreadcrumbItem[];
    goBackLink?: string;
}

const CustomBreadcrumb = ({ items, goBackLink }: BreadCrumbParams) => {
    const navigate = useNavigate();

    return (
        <Group>
            {goBackLink && <Text className={styled.back} onClick={() => navigate(goBackLink)}>&#60;</Text>}
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
        </Group>
    );
}

export default CustomBreadcrumb