import { MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getMeta } from '../api';
import { convertDeviceVersionMetaToMetaItemList as convertMetaToMetaItemList } from '../util';
import SharedSelect from './shared-select';

interface MetaSelectProps {
  device: string | null;
  version: string | null;
  value: string | null;
  onChange: (deviceVersionMeta: string | null) => void;
}

function MetaSelect(props: MetaSelectProps) {
  const metaQuery = useQuery({
    queryKey: [
      'devices',
      props.device,
      'versions',
      props.version,
      'meta',
      'meta.json',
    ],
    queryFn: async () =>
      getMeta(props.device as string, props.version as string),
    enabled: !!props.device && !!props.version,
  });
  const handleChange = (value: string | null) => {
    props.onChange(value);
  };
  return (
    <SharedSelect
      label="Meta"
      id="meta-select"
      value={props.value}
      onChange={handleChange}
      disabled={
        !props.device ||
        !props.version ||
        metaQuery.isLoading ||
        metaQuery.isError
      }
      loading={metaQuery.isLoading}
      error={metaQuery.isError}
    >
      {metaQuery.data &&
        convertMetaToMetaItemList(metaQuery.data).map((metaItem) => (
          <MenuItem key={metaItem.value} value={metaItem.value}>
            {metaItem.name}
          </MenuItem>
        ))}
    </SharedSelect>
  );
}

export default MetaSelect;
