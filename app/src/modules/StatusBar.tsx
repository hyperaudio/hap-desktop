import { useSettingsDialog } from '.';

interface StatusBarProps {}

export const StatusBar: React.FC<StatusBarProps> = ({ ...props }) => {
  const [showSettings, settingsDialog] = useSettingsDialog();
  return (
    <>
      <button onClick={() => showSettings()}>Show Settings</button>
      {settingsDialog}
    </>
  );
};

export default StatusBar;
