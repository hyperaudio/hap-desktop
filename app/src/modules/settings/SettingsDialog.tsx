import { ReactElement, Ref, forwardRef, useState, useCallback } from 'react';

import {
  AppBar,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { ColorSwitch, ModeSwitch } from '@/components';

const PREFIX = 'SettingsDialog';
const classes = {
  root: `${PREFIX}-Root`,
};

interface SettingsDialogProps extends DialogProps {
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ onClose, ...props }) => {
  return (
    <Dialog
      PaperProps={{ sx: { minHeight: '50vh' } }}
      className={classes.root}
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      {...props}
    >
      {props.open && (
        <>
          <AppBar position="absolute" color="transparent" elevation={0}>
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
              <IconButton edge="end" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>General</DialogContentText> */}
            <List>
              <ListItem divider disableGutters secondaryAction={<ModeSwitch />}>
                <ListItemText primary="Base color scheme" secondary="Choose base color scheme"></ListItemText>
              </ListItem>
              <ListItem disableGutters secondaryAction={<ColorSwitch />}>
                <ListItemText
                  primary="Accent color"
                  secondary="Choose the accent color used throughout the app"
                ></ListItemText>
              </ListItem>
            </List>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export const useSettingsDialog = (): [() => void, ReactElement] => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hideSettings = () => setIsOpen(false);
  const showSettings = () => setIsOpen(true);

  const dialogEl = <SettingsDialog onClose={hideSettings} open={isOpen} />;

  return [showSettings, dialogEl];
};

export default SettingsDialog;
