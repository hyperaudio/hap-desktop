import { useState } from 'react';
import { find, isEqual } from 'lodash';
import { useAtom } from 'jotai';

import { Button, ButtonProps, PaletteMode, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { modes } from '@/config';
import { settingsModeAtom } from '@/state';

interface ModeSwitchProps extends ButtonProps {}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ ...props }) => {
  const [mode, setMode] = useAtom(settingsModeAtom);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);
  const onSelect = (option: PaletteMode) => {
    setMode(option);
    onClose();
  };

  return (
    <>
      <Button
        id="color-button"
        aria-controls={open ? 'mode-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onOpen}
        sx={{
          minWidth: 'auto',
          pl: 1.5,
          '& .MuiButton-endIcon': { ml: 0.1 },
          '& .MuiButton-startIcon': { mr: 0.1 },
        }}
        endIcon={<ArrowDropDownIcon sx={{ color: 'text.secondary' }} />}
        {...props}
      >
        {find(modes, o => o.value === mode)?.label}
      </Button>
      <Menu
        id="mode-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'color-button',
          dense: true,
          sx: {},
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
        {modes.map((o: { label: string; value: PaletteMode }) => (
          <MenuItem key={o.value} selected={isEqual(o.value, mode)} onClick={() => onSelect(o.value)}>
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
