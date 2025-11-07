import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getVersions } from '../api';
import SharedSelect from './shared-select';

interface VersionSelectProps {
  device: string | null;
  value: string | null;
  onChange: (version: string | null) => void;
}

function VersionSelect(props: VersionSelectProps) {
  const versionsQuery = useQuery({
    queryKey: ['devices', props.device, 'versions'],
    queryFn: async () => getVersions(props.device as string),
    enabled: !!props.device,
  });
  const handleChange = (value: string | null) => {
    props.onChange(value);
  };
  return (
    <SharedSelect
      label="Version"
      id="version-select"
      value={props.value}
      onChange={handleChange}
      disabled={
        !props.device || versionsQuery.isLoading || versionsQuery.isError
      }
      loading={versionsQuery.isLoading}
      error={versionsQuery.isError}
    >
      {versionsQuery.data?.map((device) => (
        <MenuItem key={device.name} value={device.name}>
          {device.name}
        </MenuItem>
      ))}
    </SharedSelect>
  );
}

export default VersionSelect;
