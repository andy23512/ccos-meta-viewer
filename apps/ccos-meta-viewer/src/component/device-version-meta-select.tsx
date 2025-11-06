import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDeviceVersionMeta } from '../api';
import { convertDeviceVersionMetaToMetaItemList } from '../util';
import SharedSelect from './shared-select';

interface DeviceVersionMetaSelectProps {
  deviceName: string | null;
  deviceVersion: string | null;
  deviceVersionMeta: string | null;
  value: string | null;
  onChange: (deviceVersionMeta: string | null) => void;
}

function DeviceVersionMetaSelect(props: DeviceVersionMetaSelectProps) {
  const deviceVersionMetaQuery = useQuery({
    queryKey: [
      'devices',
      props.deviceName,
      'versions',
      props.deviceVersion,
      'meta',
    ],
    queryFn: async () =>
      getDeviceVersionMeta(
        props.deviceName as string,
        props.deviceVersion as string
      ),
    enabled: !!props.deviceName && !!props.deviceVersion,
  });
  const handleChange = (value: string | null) => {
    props.onChange(value);
  };
  return (
    <SharedSelect
      label="Meta"
      id="device-version-meta-select"
      value={props.value}
      onChange={handleChange}
      disabled={
        !props.deviceName ||
        !props.deviceVersion ||
        deviceVersionMetaQuery.isLoading ||
        deviceVersionMetaQuery.isError
      }
      loading={deviceVersionMetaQuery.isLoading}
    >
      {deviceVersionMetaQuery.data &&
        convertDeviceVersionMetaToMetaItemList(deviceVersionMetaQuery.data).map(
          (metaItem) => (
            <MenuItem key={metaItem.value} value={metaItem.value}>
              {metaItem.name}
            </MenuItem>
          )
        )}
    </SharedSelect>
  );
}

export default DeviceVersionMetaSelect;
