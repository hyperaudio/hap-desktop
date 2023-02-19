import { useState } from 'react';
import { isEqual } from 'lodash';
import { useAtom } from 'jotai';

import CircleIcon from '@mui/icons-material/Circle';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Menu from '@mui/material/Menu';
import { Color, IconButtonProps } from '@mui/material';

import { colors } from '@/config';
import { SettingsColorAtom } from '@/state';

interface ColorSwitchProps extends IconButtonProps {}

export const ColorSwitch: React.FC<ColorSwitchProps> = ({ ...props }) => {
  const [color, setColor] = useAtom(SettingsColorAtom);

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
        {...props}
        aria-controls={open ? 'color-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        id="color-button"
        onClick={onOpen}
        size="large"
        sx={theme => ({
          height: 'auto',
          lineHeight: '0',
          textAlign: 'center',
          width: 'auto',
        })}
      >
        <CircleIcon fontSize="large" sx={{ color: color[500] }} />
      </IconButton>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'color-button',
          dense: true,
          sx: {
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            display: 'flex',
            flexWrap: 'wrap',
            width: '170px',
            justifyContent: 'flex-start',
            px: 1,
            '& > *': {
              flex: `0 0 30px`,
              height: '30px',
            },
          },
        }}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        id="color-menu"
        onClose={onClose}
        open={open}
        sx={{ '& .MuiBackdrop-root': { background: 'none', backdropFilter: 'none' } }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {colors.map((c: Color) => (
          <ListItem key={c[500]} sx={{ justifyContent: 'center', m: 0, p: 0 }}>
            <IconButton
              onClick={() => onSelect(c)}
              sx={theme => ({ bgcolor: isEqual(c, color) ? theme.palette.action.hover : 'transparent' })}
            >
              <CircleIcon fontSize="small" sx={{ color: c[500] }} />
            </IconButton>
          </ListItem>
        ))}
      </Menu>
    </>
  );
};
