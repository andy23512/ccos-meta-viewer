import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getVersions } from '../api';
import SharedSelect from './shared-select';

interface VersionSelectProps {
  device: string | null;
  value: string | null;
  onChange: (version: string | null) => void;
  showPreReleases: boolean;
}

// A pre-release version name always carries a `-` suffix (e.g. `2.1.0-rc.0`).
function isPreRelease(version: string): boolean {
  return version.includes('-');
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
  const versions = (versionsQuery.data ?? []).filter(
    (version) =>
      props.showPreReleases ||
      !isPreRelease(version.name) ||
      version.name === props.value
  );
  const hasOnlyPreReleases =
    !!versionsQuery.data && versionsQuery.data.length > 0 && versions.length === 0;
  return (
    <SharedSelect
      label="Version"
      id="version-select"
      value={props.value}
      onChange={handleChange}
      disabled={
        !props.device ||
        versionsQuery.isLoading ||
        versionsQuery.isError ||
        hasOnlyPreReleases
      }
      loading={versionsQuery.isLoading}
      error={versionsQuery.isError}
      helperText={
        hasOnlyPreReleases
          ? 'No released versions — enable "Show pre-release versions"'
          : undefined
      }
    >
      {versions.map((version) => (
        <MenuItem key={version.name} value={version.name}>
          {version.name}
        </MenuItem>
      ))}
    </SharedSelect>
  );
}

export default VersionSelect;
