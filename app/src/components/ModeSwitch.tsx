import { useState } from 'react';
import { find, isEqual } from 'lodash';
import { useAtom } from 'jotai';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ButtonProps, PaletteMode } from '@mui/material';

import { modes } from '@/config';
import { _SettingsMode } from '@/state';

interface ModeSwitchProps extends ButtonProps {}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ ...props }) => {
  const [mode, setMode] = useAtom(_SettingsMode);

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
        {...props}
        id="mode-button"
        aria-controls={open ? 'mode-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onOpen}
        endIcon={<ArrowDropDownIcon sx={{ color: 'text.secondary' }} />}
      >
        {find(modes, o => o.value === mode)?.label}
      </Button>
      <Menu
        MenuListProps={{ 'aria-labelledby': 'mode-button', dense: true }}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        id="mode-menu"
        onClose={onClose}
        open={open}
        sx={{ '& .MuiBackdrop-root': { background: 'none', backdropFilter: 'none' } }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
