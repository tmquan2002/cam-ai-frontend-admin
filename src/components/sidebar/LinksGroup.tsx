import { Box, Group, Text, ThemeIcon, Tooltip, rem } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import styled from './sidebar.module.scss';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  path: string;
  minimize?: boolean;
  disabled?: boolean
}

export function LinksGroup({ icon: Icon, label, path, minimize, disabled }: LinksGroupProps) {

  const location = useLocation()
  return (
    <Tooltip label={label} position='right' disabled={!minimize}>
      <Link to={path} className={disabled ? `${styled["disablelink"]}` : location.pathname.includes(path!) ? `${styled["activelink"]}` : `${styled["mainlink"]}`}
        style={{ pointerEvents: disabled ? 'none' : undefined }}>
        <Group justify="space-between">
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            {!minimize && <Text fw={500} className={styled.label}>{label}</Text>}
          </Box>
        </Group>
      </Link>
    </Tooltip>
  );
}