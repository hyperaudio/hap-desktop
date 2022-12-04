import { ipcRenderer } from 'electron';
import React, { useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, List, ListItem, Tooltip } from '@mui/material';

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
            <Tooltip arrow title="Create new…" placement="right">
              <IconButton onClick={() => alert('Let me create a new file from here.')}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block', textAlign: 'center' }}>
            <Tooltip arrow title="Open existing…" placement="right">
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
