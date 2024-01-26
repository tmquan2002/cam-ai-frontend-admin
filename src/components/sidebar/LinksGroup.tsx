import { Box, Group, Text, ThemeIcon, rem, Tooltip } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import styled from './sidebar.module.scss';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  path: string;
  minimize?: boolean
}

export function LinksGroup({ icon: Icon, label, path, minimize }: LinksGroupProps) {

  const location = useLocation()
  if (minimize) {
    return (
      <Tooltip label={label} withArrow position='right'>
        <Link to={path} className={location.pathname.includes(path!) ? `${styled["activelink-minimize"]}` : `${styled["mainlink-minimize"]}`}>
          <Group justify="space-between">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon size={30}>
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
            </Box>
          </Group>
        </Link>
      </Tooltip>
    );
  } else {
    return (
      <Link to={path} className={location.pathname.includes(path!) ? `${styled["activelink"]}` : `${styled["mainlink"]}`}>
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
}