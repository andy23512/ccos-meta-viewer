import { Device, DeviceVersion } from './model';

export async function getDevices(): Promise<Device[]> {
  const response = await fetch('https://charachorder.io/firmware/');
  return await response.json();
}

export async function getDeviceVersions(
  deviceName: string
): Promise<DeviceVersion[]> {
  const response = await fetch(
    `https://charachorder.io/firmware/${deviceName}/`
  );
  return await response.json();
}
