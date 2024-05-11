import { Box, Group, Text, ThemeIcon, Tooltip, rem } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import styled from './linkgroups.module.scss';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  path: string;
  minimize?: boolean;
}

export function LinksGroup({ icon: Icon, label, path, minimize }: LinksGroupProps) {
  const location = useLocation()
  return (
    <Tooltip label={label} position='right' disabled={!minimize}>
      <Link to={path} className={location.pathname.includes(path!) ? `${styled["activelink"]}` : `${styled["mainlink"]}`}>
        <Group justify="space-between">
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon size={30} variant="transparent" className={location.pathname.includes(path!) ? `${styled["activeicon"]}` : `${styled["mainicon"]}`}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            {!minimize && <Text fw={500} className={styled.label} ta="left">{label}</Text>}
          </Box>
        </Group>
      </Link>
    </Tooltip>
  );
}