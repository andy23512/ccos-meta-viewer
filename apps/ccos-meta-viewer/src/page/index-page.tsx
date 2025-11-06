import { Box } from '@mui/material';
import { useState } from 'react';
import DeviceSelect from '../component/device-select';
import DeviceVersionSelect from '../component/device-version-select';

export function IndexPage() {
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [deviceVersion, setDeviceVersion] = useState<string | null>(null);

  const handleDeviceSelectChange = (value: string | null) => {
    setDeviceName(value);
  };
  const handleDeviceVersionSelectChange = (value: string | null) => {
    setDeviceVersion(value);
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
    </Box>
  );
}

export default IndexPage;
