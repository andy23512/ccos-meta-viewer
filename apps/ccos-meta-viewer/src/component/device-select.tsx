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
import { getDevices } from '../api';

interface DeviceSelectProps {
  value: string | null;
  onChange: (deviceName: string | null) => void;
}

function DeviceSelect(props: DeviceSelectProps) {
  const devicesQuery = useQuery({ queryKey: ['devices'], queryFn: getDevices });
  const handleChange = (event: SelectChangeEvent<string | null>) => {
    props.onChange(event.target.value);
  };
  return (
    <FormControl sx={{ width: 200 }}>
      <InputLabel id="device-select-label">Device</InputLabel>
      <Select
        input={<OutlinedInput label="Device" />}
        labelId="device-select-label"
        id="device-select"
        value={props.value}
        onChange={handleChange}
        disabled={devicesQuery.isLoading || devicesQuery.isError}
      >
        {devicesQuery.isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20}></CircularProgress>
          </MenuItem>
        ) : (
          devicesQuery.data?.map((device) => (
            <MenuItem key={device.name} value={device.name}>
              {device.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

export default DeviceSelect;
