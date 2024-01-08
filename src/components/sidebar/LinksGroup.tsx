import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, rem, Text } from '@mantine/core';
import { AiFillCaretRight } from "react-icons/ai";
import styled from './sidebar.module.scss';
import { Link, NavLink } from 'react-router-dom';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  //Check links property first and ignore path property, then check path property if links property is not available
  //Do nothing if both are not available

  //Use links if there are sub links of the main one
  links?: { label: string; path: string }[];
  //Use path if there is no sub links
  path?: string
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, path }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link, index) => (
    <NavLink to={link.path} className={styled.sublink} key={index}>
      {link.label}
    </NavLink>
  ));

  return (
    <>
      <div className={styled.mainlink} onClick={() => setOpened(!opened)}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            {(path && !hasLinks) ?
              <Link to={path} className={styled.label}>{label}</Link> :
              <Text className={styled.label}>{label}</Text>
            }
          </Box>
          {hasLinks && (
            <AiFillCaretRight
              className={styled.chevron}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </div>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}