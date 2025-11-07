import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '../api';
import SharedSelect from './shared-select';

interface DeviceSelectProps {
  value: string | null;
  onChange: (deviceName: string | null) => void;
}

function DeviceSelect(props: DeviceSelectProps) {
  const devicesQuery = useQuery({ queryKey: ['devices'], queryFn: getDevices });
  const handleChange = (value: string | null) => {
    props.onChange(value);
  };
  return (
    <SharedSelect
      label="Device"
      id="device-select"
      value={props.value}
      onChange={handleChange}
      disabled={devicesQuery.isLoading || devicesQuery.isError}
      loading={devicesQuery.isLoading}
      error={devicesQuery.isError}
    >
      {devicesQuery.data?.map((device) => (
        <MenuItem key={device.name} value={device.name}>
          {device.name}
        </MenuItem>
      ))}
    </SharedSelect>
  );
}

export default DeviceSelect;
