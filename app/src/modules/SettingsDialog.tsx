import { ReactElement, Ref, forwardRef, useState, useCallback } from 'react';
import { isEqual } from 'lodash';
import { useAtom } from 'jotai';

import {
  AppBar,
  Color,
  Dialog,
  DialogContent,
  DialogProps,
  Avatar,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Slide,
  Stack,
  Switch,
  Toolbar,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

import { colors } from '@/config';
import { settingsModeAtom, settingsColorAtom } from '@/state';

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
  const [mode, setMode] = useAtom(settingsModeAtom);
  const [color, setColor] = useAtom(settingsColorAtom);

  const onModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setMode(e.target.checked ? 'dark' : 'light'),
    [setMode],
  );

  const onColorChange = useCallback((c: Color) => setColor(c), [setColor]);

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
                control={<Switch color="primary" checked={mode === 'dark'} onChange={onModeChange} />}
                label="Dark mode"
                labelPlacement="start"
                sx={{ justifyContent: 'space-between', ml: 0 }}
                value="start"
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Stack direction="row">
                    {colors.map((c: Color) => {
                      return (
                        <IconButton
                          disabled={isEqual(c, color)}
                          key={c[500]}
                          onClick={() => onColorChange(c)}
                          size="small"
                        >
                          <Avatar
                            sx={theme => ({
                              bgcolor: c[500],
                              height: theme.spacing(2.22),
                              width: theme.spacing(2.22),
                            })}
                          />
                        </IconButton>
                      );
                    })}
                  </Stack>
                }
                label="Color"
                labelPlacement="start"
                sx={{ alignItems: 'center', justifyContent: 'space-between', ml: 0 }}
                value="start"
              />
            </FormControl>
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
