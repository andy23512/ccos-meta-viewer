import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDeviceVersions } from '../api';
import SharedSelect from './shared-select';

interface DeviceVersionSelectProps {
  deviceName: string | null;
  value: string | null;
  onChange: (deviceVersion: string | null) => void;
}

function DeviceVersionSelect(props: DeviceVersionSelectProps) {
  const deviceVersionsQuery = useQuery({
    queryKey: ['devices', props.deviceName, 'versions'],
    queryFn: async () => getDeviceVersions(props.deviceName as string),
    enabled: !!props.deviceName,
  });
  const handleChange = (value: string | null) => {
    props.onChange(value);
  };
  return (
    <SharedSelect
      label="Version"
      id="device-version-select"
      value={props.value}
      onChange={handleChange}
      disabled={
        !props.deviceName ||
        deviceVersionsQuery.isLoading ||
        deviceVersionsQuery.isError
      }
      loading={deviceVersionsQuery.isLoading}
    >
      {deviceVersionsQuery.data?.map((device) => (
        <MenuItem key={device.name} value={device.name}>
          {device.name}
        </MenuItem>
      ))}
    </SharedSelect>
  );
}

export default DeviceVersionSelect;
