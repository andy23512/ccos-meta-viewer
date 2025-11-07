import { Meta } from './model';

export function convertDeviceVersionMetaToMetaItemList(meta: Meta) {
  return [
    { name: 'Actions', value: meta.actions },
    { name: 'Changelog', value: meta.changelog },
    { name: 'Settings', value: meta.settings },
    { name: 'Factory Default Layout', value: meta.factory_defaults.layout },
    { name: 'Factory Default Settings', value: meta.factory_defaults.settings },
    {
      name: 'Factory Default Functional Chords',
      value: meta.factory_defaults.chords['functional'],
    },
    {
      name: 'Factory Default Starter Chords',
      value: meta.factory_defaults.chords['starter'],
    },
  ];
}
