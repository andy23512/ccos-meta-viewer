import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DeviceSelect from '../component/device-select';
import MetaSelect from '../component/meta-select';
import MetaView from '../component/meta-view';
import VersionSelect from '../component/version-select';

export function IndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // 網址是 device / version / meta 的唯一資料來源，
  // 這樣貼上新網址或按上一頁／下一頁時，畫面才會跟著網址走。
  const device = searchParams.get('device');
  const version = searchParams.get('version');
  const meta = searchParams.get('meta');
  const [showPreReleases, setShowPreReleases] = useState(false);

  const updateParams = (
    nextDevice: string | null,
    nextVersion: string | null,
    nextMeta: string | null
  ) => {
    const params = new URLSearchParams();
    if (nextDevice) {
      params.set('device', nextDevice);
    }
    if (nextVersion) {
      params.set('version', nextVersion);
    }
    if (nextMeta) {
      params.set('meta', nextMeta);
    }
    setSearchParams(params);
  };

  const handleDeviceSelectChange = (value: string | null) => {
    updateParams(value, null, null);
  };
  const handleVersionSelectChange = (value: string | null) => {
    updateParams(device, value, null);
  };
  const handleMetaSelectChange = (value: string | null) => {
    updateParams(device, version, value);
  };

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
      <Box
        sx={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <DeviceSelect
          value={device}
          onChange={handleDeviceSelectChange}
        ></DeviceSelect>
        <VersionSelect
          device={device}
          value={version}
          onChange={handleVersionSelectChange}
          showPreReleases={showPreReleases}
        ></VersionSelect>
        <MetaSelect
          device={device}
          version={version}
          value={meta}
          onChange={handleMetaSelectChange}
        ></MetaSelect>
        <FormControlLabel
          control={
            <Checkbox
              checked={showPreReleases}
              onChange={(event) => setShowPreReleases(event.target.checked)}
            />
          }
          label="Show pre-release versions"
        />
      </Box>
      <MetaView device={device} version={version} meta={meta}></MetaView>
    </Box>
  );
}

export default IndexPage;
