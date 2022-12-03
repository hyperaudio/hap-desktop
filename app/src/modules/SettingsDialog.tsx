import { ReactElement, Ref, forwardRef, useState, useCallback } from 'react';

import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Slide,
  Switch,
  Toolbar,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

import { SettingsI } from '../typings';
import { SettingsAtom } from '../state';
import { useAtom } from 'jotai';

const PREFIX = 'SettingsDialog';
const classes = {
  root: `${PREFIX}-Root`,
};

interface SettingsDialogProps extends DialogProps {
  onClose: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ onClose, ...props }) => {
  const [settings, setSettings] = useAtom(SettingsAtom);

  const onThemeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSettings({ theme: e.target.checked ? 'dark' : 'light' }),
    [setSettings],
  );

  console.log({ settings });

  return (
    <Dialog
      PaperProps={{ sx: { minHeight: '50vh' } }}
      TransitionComponent={Transition}
      className={classes.root}
      fullWidth
      maxWidth="xs"
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
            <FormControl fullWidth>
              <FormControlLabel
                control={<Switch color="primary" checked={settings.theme === 'dark'} onChange={onThemeChange} />}
                label="Dark mode"
                labelPlacement="start"
                sx={{ justifyContent: 'space-between', ml: 0 }}
                value="start"
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
            <Button>Do nothing</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export const useSettingsDialog = (): [(entry?: SettingsI) => void, ReactElement] => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hideSettings = () => setIsOpen(false);
  const showSettings = () => setIsOpen(true);

  const dialogEl = <SettingsDialog onClose={hideSettings} open={isOpen} />;

  return [showSettings, dialogEl];
};

export default SettingsDialog;
