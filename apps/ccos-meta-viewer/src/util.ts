import { Meta } from './model';

const SANITIZE_ALLOWED_TAGS = ['i', 'b', 'code', 'br'];

export function sanitizeInlineHtml(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return SANITIZE_ALLOWED_TAGS.reduce(
    (html, tag) =>
      html
        .replace(new RegExp(`&lt;${tag}&gt;`, 'g'), `<${tag}>`)
        .replace(new RegExp(`&lt;/${tag}&gt;`, 'g'), `</${tag}>`),
    escaped
  );
}

export function convertDeviceVersionMetaToMetaItemList(meta: Meta) {
  const items: { name: string; value: string | undefined }[] = [
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
    {
      name: 'Factory Default Riley Chords',
      value: meta.factory_defaults.chords['riley'],
    },
    {
      name: 'Factory Default Arpeggiates',
      value: meta.factory_defaults.chords['arpeggiates'],
    },
    { name: 'Recipes', value: meta.recipes },
  ];
  return items.filter((item) => item.value) as {
    name: string;
    value: string;
  }[];
}
