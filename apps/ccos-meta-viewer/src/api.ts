import { Device, Meta, Version } from './model';

export async function getDevices(): Promise<Device[]> {
  const response = await fetch('https://charachorder.io/firmware/');
  return await response.json();
}

export async function getVersions(device: string): Promise<Version[]> {
  const response = await fetch(`https://charachorder.io/firmware/${device}/`);
  return await response.json();
}

export async function getMeta(device: string, version: string): Promise<Meta> {
  return getMetaFile(device, version, 'meta.json');
}

export async function getMetaFile(
  device: string,
  version: string,
  file: string
): Promise<Meta> {
  const response = await fetch(
    `https://charachorder.io/firmware/${device}/${version}/${file}`
  );
  return await response.json();
}
