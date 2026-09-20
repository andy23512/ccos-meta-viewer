import { subset } from '@web-alchemy/fonttools';
import { Font, openSync as fontkitOpenSync } from 'fontkit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FIRMWARE_BASE_URL = 'https://charachorder.io/firmware';
const FONT_PATH = join(
  __dirname,
  '../assets/material-symbols-rounded-latin-full-normal.woff2'
);
const OUTPUT_PATH = join(
  __dirname,
  '../assets/material-symbols-rounded-latin-full-normal.min.woff2'
);
// Icon names used directly in JSX (not sourced from the firmware API).
const STATIC_ICONS = ['add_circle', 'bug_report', 'circle'];
const REQUEST_CONCURRENCY = 10;

interface DirectoryEntry {
  name: string;
  type: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return (await response.json()) as T;
}

function collectIcons(value: unknown, icons: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectIcons(item, icons));
  } else if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      if (key === 'icon' && typeof nested === 'string') {
        icons.add(nested);
      } else {
        collectIcons(nested, icons);
      }
    }
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await fn(items[current]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker)
  );
  return results;
}

async function collectAllActionIcons(): Promise<Set<string>> {
  const icons = new Set<string>(STATIC_ICONS);

  const devices = await fetchJson<DirectoryEntry[]>(`${FIRMWARE_BASE_URL}/`);
  const combos = (
    await mapWithConcurrency(
      devices.filter((device) => device.type === 'directory'),
      REQUEST_CONCURRENCY,
      async (device) => {
        const versions = await fetchJson<DirectoryEntry[]>(
          `${FIRMWARE_BASE_URL}/${device.name}/`
        );
        return versions
          .filter((version) => version.type === 'directory')
          .map((version) => ({ device: device.name, version: version.name }));
      }
    )
  ).flat();

  console.log(`Scanning ${combos.length} device/version combinations...`);

  await mapWithConcurrency(
    combos,
    REQUEST_CONCURRENCY,
    async ({ device, version }) => {
      try {
        const meta = await fetchJson<{ actions: string }>(
          `${FIRMWARE_BASE_URL}/${device}/${version}/meta.json`
        );
        const actions = await fetchJson<unknown>(
          `${FIRMWARE_BASE_URL}/${device}/${version}/${meta.actions}`
        );
        collectIcons(actions, icons);
      } catch (error) {
        console.warn(
          `Skipping ${device}/${version}: ${(error as Error).message}`
        );
      }
    }
  );

  return icons;
}

(async () => {
  const iconSet = await collectAllActionIcons();
  console.log(`Found ${iconSet.size} unique icon names.`);

  const font = fontkitOpenSync(FONT_PATH) as Font;
  const glyphs = ['5f-7a', '30-39'];
  const unresolvedIcons: string[] = [];

  for (const icon of iconSet) {
    const iconGlyphs = font.layout(icon).glyphs;
    if (iconGlyphs.length !== 1) {
      unresolvedIcons.push(icon);
      continue;
    }
    const codePoints = iconGlyphs
      .flatMap((glyph) => font.stringsForGlyph(glyph.id))
      .flatMap((str) => [...str])
      .map((char) => char.codePointAt(0)?.toString(16) as string);
    glyphs.push(...codePoints);
  }

  if (unresolvedIcons.length > 0) {
    console.warn(
      `${unresolvedIcons.length} icon name(s) are not valid Material Symbols ligatures and will keep rendering as plain text: ${unresolvedIcons.join(', ')}`
    );
  }

  glyphs.sort();

  const inputFileBuffer = readFileSync(FONT_PATH);
  const outputFileBuffer = await subset(inputFileBuffer, {
    unicodes: glyphs.join(','),
    'no-layout-closure': true,
    flavor: 'woff2',
  });
  writeFileSync(OUTPUT_PATH, outputFileBuffer);
  console.log(`Wrote ${OUTPUT_PATH}`);
})();
