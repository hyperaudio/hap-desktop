import { useState } from 'react';
import { isEqual } from 'lodash';
import { useAtom } from 'jotai';

import { ButtonProps, Box, BoxProps, Color, Menu, MenuItem, IconButton } from '@mui/material';

import { colors } from '@/config';
import { settingsColorAtom } from '@/state';

interface ColorSwitchProps extends ButtonProps {}

interface ColorSampleProps extends Omit<BoxProps, 'color'> {
  color: Color;
  size?: 'small' | 'medium' | 'large';
}

const ColorSample: React.FC<ColorSampleProps> = ({ color, size = 'medium', ...props }) => {
  const sizes = {
    small: 2,
    medium: 2.5,
    large: 3,
  };
  return (
    <Box
      {...props}
      sx={theme => ({
        background: color[500],
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(sizes[size]),
        width: theme.spacing(sizes[size]),
      })}
    />
  );
};

export const ColorSwitch: React.FC<ColorSwitchProps> = ({ ...props }) => {
  const [color, setColor] = useAtom(settingsColorAtom);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);
  const onSelect = (c: Color) => {
    setColor(c);
    onClose();
  };

  return (
    <>
      <IconButton
        id="color-button"
        aria-controls={open ? 'color-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onOpen}
        size="medium"
        {...props}
      >
        <ColorSample color={color} size="large" />
      </IconButton>
      <Menu
        id="color-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'color-button',
          dense: true,
          sx: {
            display: 'flex',
            flexWrap: 'wrap',
            px: 1,
            '& > *': {
              flex: '1 1 25%',
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{ '& .MuiBackdrop-root': { background: 'none', backdropFilter: 'none' } }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        variant="selectedMenu"
      >
        {colors.map((c: Color) => (
          <MenuItem
            key={c[500]}
            selected={isEqual(c, color)}
            onClick={() => onSelect(c)}
            sx={theme => ({
              borderRadius: theme.shape.borderRadius,
              height: 'auto',
              justifyContent: 'center',
              m: 0,
              p: 0,
              width: 'auto',
            })}
          >
            <ColorSample color={c} size="small" />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
