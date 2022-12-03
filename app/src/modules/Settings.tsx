import { ReactElement, Ref, createRef, forwardRef, useState } from 'react';

import { Button, Dialog, DialogProps, Slide, Container } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { SettingsI } from '../../typings';

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
  const paperRef = createRef<HTMLDivElement>();

  return (
    <Dialog
      {...props}
      className={classes.root}
      fullScreen
      PaperProps={{
        ref: paperRef,
        sx: {},
      }}
      scroll="paper"
      TransitionComponent={Transition}
    >
      {props.open && (
        <Container maxWidth="xs" sx={{ my: 2 }}>
          Settings go here
          <Button onClick={onClose}>Close</Button>
        </Container>
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
