import { DeviceVersionMeta } from './model';

export function convertDeviceVersionMetaToMetaItemList(
  meta: DeviceVersionMeta
) {
  return [
    { name: 'Actions', value: meta.actions },
    { name: 'Settings', value: meta.settings },
  ];
}
