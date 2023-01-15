import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ToolbarProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useCloseProjectDialog } from './CloseProjectDialog';

interface TabBarProps extends ToolbarProps {}

const PREFIX = 'TabBar';
const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  closeButton: `${PREFIX}-closeButton`,
  contentEditable: `${PREFIX}-contentEditable`,
};

const Root = styled(Toolbar)(({ theme }) => ({
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.up('xs')]: {
    height: '48px',
    minHeight: 'auto',
  },
  [`& .${classes.title}`]: {
    display: 'inline-block',
    position: 'relative',
  },
  [`& .${classes.contentEditable}`]: {
    border: 'none',
    outline: 'none',
  },
  [`& .${classes.closeButton}`]: {
    background: theme.palette.action.hover,
    left: '100%',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.33),
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

export const TabBar: React.FC<TabBarProps> = ({ ...props }) => {
  const [showCloseDialog, closeDialog] = useCloseProjectDialog();

  const onSaveTitle = e => {
    console.log('onSaveTitle');
  };
  const onClose = () => {
    showCloseDialog();
  };
  return (
    <>
      <Root className={classes.root}>
        <Box>
          <Typography className={classes.title} color="text.primary" component="h1" variant="h6">
            <span
              // contentEditable
              // spellCheck={false}
              className={classes.contentEditable}
              onBlur={e => onSaveTitle(e)}
            >{`Project name`}</span>
            <Tooltip title="Close project">
              <IconButton className={classes.closeButton} onClick={onClose}>
                <CloseIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
      </Root>
      {closeDialog}
    </>
  );
};

export default TabBar;
