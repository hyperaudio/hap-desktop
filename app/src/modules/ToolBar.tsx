import { ipcRenderer } from 'electron';
import React, { useCallback } from 'react';

import { IconButton, List, ListItem, Tooltip } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { useSettingsDialog } from '@/modules';
import { Stack } from '@mui/system';

interface ToolBarProps {}

export const ToolBar: React.FC<ToolBarProps> = ({ ...props }) => {
  const [showSettings, settingsDialog] = useSettingsDialog();

  const openFile = useCallback(() => ipcRenderer.invoke('relay-menu-action', 'open'), []);

  return (
    <>
      <Stack direction="column" justifyContent="space-between" spacing={1} sx={{ height: '100%' }}>
        <List component={Stack} spacing={1}>
          <ListItem disablePadding sx={{ display: 'block', textAlign: 'center' }}>
            <Tooltip arrow title="Open file…" placement="right">
              <IconButton onClick={openFile}>
                <FileOpenIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        </List>
        <List component={Stack} spacing={1}>
          <ListItem disablePadding sx={{ display: 'block', textAlign: 'center' }}>
            <Tooltip arrow title="About" placement="right">
              <IconButton onClick={() => alert('Lemme learn more about the app!')}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block', textAlign: 'center' }}>
            <Tooltip arrow title="Settings" placement="right">
              <IconButton onClick={() => showSettings()}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        </List>
      </Stack>
      {settingsDialog}
    </>
  );
};

export default ToolBar;
