import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DeviceSelect from '../component/device-select';
import MetaSelect from '../component/meta-select';
import MetaView from '../component/meta-view';
import VersionSelect from '../component/version-select';

export function IndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [device, setDevice] = useState<string | null>(
    searchParams.get('device')
  );
  const [version, setVersion] = useState<string | null>(
    searchParams.get('version')
  );
  const [meta, setMeta] = useState<string | null>(searchParams.get('meta'));

  const handleDeviceSelectChange = (value: string | null) => {
    setDevice(value);
    setVersion(null);
    setMeta(null);
  };
  const handleVersionSelectChange = (value: string | null) => {
    setVersion(value);
    setMeta(null);
  };
  const handleMetaSelectChange = (value: string | null) => {
    setMeta(value);
  };

  useEffect(() => {
    setSearchParams(() => {
      const params = new URLSearchParams();
      if (device) {
        params.set('device', device);
      }
      if (version) {
        params.set('version', version);
      }
      if (meta) {
        params.set('meta', meta);
      }
      return params;
    });
  }, [device, version, meta]);
  return (
    <Box
      sx={{
        p: 2,
        flex: '1 1 0',
        minHeight: 0,
        display: 'flex',
        gap: 2,
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flex: '0 0 auto' }}>
        <DeviceSelect
          value={device}
          onChange={handleDeviceSelectChange}
        ></DeviceSelect>
        <VersionSelect
          device={device}
          value={version}
          onChange={handleVersionSelectChange}
        ></VersionSelect>
        <MetaSelect
          device={device}
          version={version}
          value={meta}
          onChange={handleMetaSelectChange}
        ></MetaSelect>
      </Box>
      <MetaView device={device} version={version} meta={meta}></MetaView>
    </Box>
  );
}

export default IndexPage;
