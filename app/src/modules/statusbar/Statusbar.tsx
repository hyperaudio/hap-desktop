import Box from '@mui/material/Box';
import { BoxProps } from '@mui/material';

interface StatusBarProps extends BoxProps {}

export const StatusBar: React.FC<StatusBarProps> = ({ ...props }) => {
  return <Box sx={theme => ({ ...theme.typography.caption })}>Status bar goes here</Box>;
};

export default StatusBar;
