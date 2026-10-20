import { Meta } from './model';
import {
  convertDeviceVersionMetaToMetaItemList,
  sanitizeInlineHtml,
} from './util';

describe('sanitizeInlineHtml', () => {
  it('keeps allowed tags', () => {
    expect(sanitizeInlineHtml('<b>a</b> <i>b</i> <code>c</code>')).toBe(
      '<b>a</b> <i>b</i> <code>c</code>'
    );
    expect(sanitizeInlineHtml('a<br>b')).toBe('a<br>b');
  });

  it('escapes other tags', () => {
    expect(sanitizeInlineHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('escapes attributes on allowed tags', () => {
    expect(sanitizeInlineHtml('<b onclick="x">a</b>')).toBe(
      '&lt;b onclick="x"&gt;a</b>'
    );
  });

  it('escapes ampersands once', () => {
    expect(sanitizeInlineHtml('a & b &lt;')).toBe('a &amp; b &amp;lt;');
  });
});

describe('convertDeviceVersionMetaToMetaItemList', () => {
  const baseMeta = {
    actions: 'actions.json',
    changelog: 'changelog.json',
    settings: 'settings.json',
    factory_defaults: {
      layout: 'factory_layout.json',
      settings: 'factory_settings.json',
      chords: {
        starter: 'starter_chords.json',
        functional: 'functional_chords.json',
      },
    },
  } as unknown as Meta;

  it('lists the files in a fixed order', () => {
    expect(convertDeviceVersionMetaToMetaItemList(baseMeta)).toEqual([
      { name: 'Actions', value: 'actions.json' },
      { name: 'Changelog', value: 'changelog.json' },
      { name: 'Settings', value: 'settings.json' },
      { name: 'Factory Default Layout', value: 'factory_layout.json' },
      { name: 'Factory Default Settings', value: 'factory_settings.json' },
      {
        name: 'Factory Default Functional Chords',
        value: 'functional_chords.json',
      },
      { name: 'Factory Default Starter Chords', value: 'starter_chords.json' },
    ]);
  });

  it('adds riley, arpeggiates and recipes when present', () => {
    const meta = {
      ...baseMeta,
      recipes: 'recipes.json',
      factory_defaults: {
        ...baseMeta.factory_defaults,
        chords: {
          ...baseMeta.factory_defaults.chords,
          riley: 'riley_chords.json',
          arpeggiates: 'arpeggiates.json',
        },
      },
    } as Meta;
    expect(convertDeviceVersionMetaToMetaItemList(meta).slice(-3)).toEqual([
      { name: 'Factory Default Riley Chords', value: 'riley_chords.json' },
      { name: 'Factory Default Arpeggiates', value: 'arpeggiates.json' },
      { name: 'Recipes', value: 'recipes.json' },
    ]);
  });
});
