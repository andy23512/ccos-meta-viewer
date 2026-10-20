import { Device, Meta, Version } from './model';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${url}`);
  }
  return await response.json();
}

export async function getDevices(): Promise<Device[]> {
  return fetchJson('https://charachorder.io/firmware/');
}

export async function getVersions(device: string): Promise<Version[]> {
  return fetchJson(`https://charachorder.io/firmware/${device}/`);
}

export async function getMeta(device: string, version: string): Promise<Meta> {
  return getMetaFile(device, version, 'meta.json');
}

export async function getMetaFile(
  device: string,
  version: string,
  file: string
): Promise<Meta> {
  return fetchJson(
    `https://charachorder.io/firmware/${device}/${version}/${file}`
  );
}
