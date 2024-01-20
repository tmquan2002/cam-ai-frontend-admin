import { Box, Group, Text, ThemeIcon, rem } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import styled from './sidebar.module.scss';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  path: string
}

export function LinksGroup({ icon: Icon, label, path }: LinksGroupProps) {

  const location = useLocation()

  return (
    <Link to={path} className={location.pathname.includes(path!) ? `${styled.activelink}` : `${styled.mainlink}`}>
      <Group justify="space-between">
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeIcon size={30}>
            <Icon style={{ width: rem(18), height: rem(18) }} />
          </ThemeIcon>
          <Text className={styled.label}>{label}</Text>
        </Box>
      </Group>
    </Link>
  );
}