import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDeviceVersions } from '../api';

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
  const handleChange = (event: SelectChangeEvent<string | null>) => {
    props.onChange(event.target.value);
  };
  return (
    <FormControl sx={{ width: 200 }}>
      <InputLabel id="device-version-select-label">Version</InputLabel>
      <Select
        input={<OutlinedInput label="Version" />}
        labelId="device-version-select-label"
        id="device-version-select"
        value={props.value}
        onChange={handleChange}
        disabled={
          !props.deviceName ||
          deviceVersionsQuery.isLoading ||
          deviceVersionsQuery.isError
        }
      >
        {deviceVersionsQuery.isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20}></CircularProgress>
          </MenuItem>
        ) : (
          deviceVersionsQuery.data?.map((device) => (
            <MenuItem key={device.name} value={device.name}>
              {device.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

export default DeviceVersionSelect;
