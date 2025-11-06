import { Box } from '@mui/material';
import { useState } from 'react';
import DeviceSelect from '../component/device-select';
import DeviceVersionMetaSelect from '../component/device-version-meta-select';
import DeviceVersionSelect from '../component/device-version-select';

export function IndexPage() {
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [deviceVersion, setDeviceVersion] = useState<string | null>(null);
  const [deviceVersionMeta, setDeviceVersionMeta] = useState<string | null>(
    null
  );

  const handleDeviceSelectChange = (value: string | null) => {
    setDeviceName(value);
  };
  const handleDeviceVersionSelectChange = (value: string | null) => {
    setDeviceVersion(value);
  };
  const handleDeviceVersionMetaSelectChange = (value: string | null) => {
    setDeviceVersionMeta(value);
  };
  return (
    <Box sx={{ p: 10 }}>
      <DeviceSelect
        value={deviceName}
        onChange={handleDeviceSelectChange}
      ></DeviceSelect>
      <DeviceVersionSelect
        deviceName={deviceName}
        value={deviceVersion}
        onChange={handleDeviceVersionSelectChange}
      ></DeviceVersionSelect>
      <DeviceVersionMetaSelect
        deviceName={deviceName}
        deviceVersion={deviceVersion}
        deviceVersionMeta={deviceVersionMeta}
        value={deviceVersionMeta}
        onChange={handleDeviceVersionMetaSelectChange}
      ></DeviceVersionMetaSelect>
    </Box>
  );
}

export default IndexPage;
