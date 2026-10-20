import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import '../swagger-dark/SwaggerDark.css';

const spiConnectionSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    clk: { type: 'number' },
    q: { type: 'number' },
    d: { type: 'number' },
    hd: { type: 'number' },
    cs: { type: 'number' },
  },
};

const spiFlashSchema: OpenAPIV3_1.SchemaObject = {
  type: ['object', 'null'],
  description: 'Only present in some devices. null in some builds.',
  properties: {
    type: { type: 'string' },
    size: { type: 'string' },
    connection: spiConnectionSchema,
    spi_connection: {
      ...spiConnectionSchema,
      description:
        'Same shape as connection. Some devices use this name instead.',
    },
  },
};

const espToolSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    chip: { type: 'string' },
    baud: { type: 'string' },
    before: { type: 'string' },
    after: { type: 'string' },
    flash_mode: { type: 'string' },
    flash_freq: { type: 'string' },
    flash_size: { type: 'string' },
    files: {
      type: 'object',
      description:
        'Flash address to file name. The addresses differ between devices.',
      additionalProperties: { type: 'string' },
      example: {
        '0x0000': 'bootloader-tinyuf2.bin',
        '0x8000': 'partitions.bin',
        '0xe000': 'boot_app0.bin',
        '0x10000': 'firmware.bin',
        '0x410000': 'tinyuf2.bin',
      },
    },
  },
};

// The shape of `update` depends on the device
const updateSchema: OpenAPIV3_1.SchemaObject = {
  oneOf: [
    {
      title: 'ota / uf2 / esptool',
      type: 'object',
      properties: {
        ota: { type: 'string' },
        uf2: { type: 'string' },
        esptool: {
          ...espToolSchema,
          type: ['object', 'null'],
          description:
            'null in some one_m0 builds. Missing in some lite_m0 and one_m0 builds.',
        },
      },
    },
    {
      title: 'so (zero_linux)',
      type: 'object',
      properties: { so: { type: 'string' } },
    },
    {
      title: 'js / wasm (zero_wasm)',
      type: 'object',
      properties: { js: { type: 'string' }, wasm: { type: 'string' } },
    },
    {
      title: 'dll (zero_win)',
      type: 'object',
      properties: { dll: { type: 'string' } },
    },
  ],
};

const FILE_EXAMPLES = [
  'actions.json',
  'changelog.json',
  'settings.json',
  'factory_layout.json',
  'factory_settings.json',
  'starter_chords.json',
  'functional_chords.json',
  'arpeggiates.json',
  'recipes.json',
];

export function SwaggerPage() {
  const spec: OpenAPIV3_1.Document = {
    openapi: '3.1.0',
    info: {
      title: 'CCOS firmware meta API',
      version: '1.0.0',
      description:
        'Firmware Meta API is an important part for developing tooling that interacts with CCOS and used by https://charachorder.io/.',
    },
    servers: [
      {
        url: 'https://charachorder.io',
        description: 'charachorder.io server',
      },
    ],
    paths: {
      '/firmware/': {
        get: {
          summary: 'Get all available CCOS devices',
          responses: {
            200: {
              description: 'A list of CCOS devices',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        type: { type: 'string' },
                        mtime: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/firmware/{device}/': {
        get: {
          summary: 'Get publicly available builds of a CCOS device',
          parameters: [
            {
              name: 'device',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'A list of publicly available builds',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        type: { type: 'string' },
                        mtime: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/firmware/{device}/{version}/meta.json': {
        get: {
          summary: 'Get firmware specific meta',
          parameters: [
            {
              name: 'device',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'version',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Meta of the firmware build',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      target: { type: 'string' },
                      version: { type: 'string' },
                      usb_version: { type: 'string' },
                      git_commit: { type: 'string' },
                      git_is_dirty: { type: 'boolean' },
                      git_date: { type: 'string' },
                      public_build: { type: 'boolean' },
                      development_mode: { type: 'number' },
                      factory_defaults: {
                        type: 'object',
                        properties: {
                          layout: { type: 'string' },
                          settings: { type: 'string' },
                          chords: {
                            type: 'object',
                            properties: {
                              starter: { type: 'string' },
                              functional: { type: 'string' },
                              riley: {
                                type: 'string',
                                description: 'Only present in some builds.',
                              },
                              arpeggiates: {
                                type: 'string',
                                description: 'Only present in some builds.',
                              },
                            },
                          },
                        },
                      },
                      update: updateSchema as OpenAPIV3.SchemaObject,
                      actions: { type: 'string' },
                      settings: { type: 'string' },
                      changelog: { type: 'string' },
                      recipes: {
                        type: 'string',
                        description: 'Only present in some builds.',
                      },
                      files: { type: 'array', items: { type: 'string' } },
                      // `properties` is typed with the OpenAPI 3.0 schema in
                      // openapi-types, which has no 'null' type
                      spi_flash: spiFlashSchema as OpenAPIV3.SchemaObject,
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/firmware/{device}/{version}/{file}': {
        get: {
          summary: 'Get firmware specific meta file',
          description: [
            'Get a file listed in the `files` field of `meta.json`. The available files depend on the device and version.',
            '',
            '- JSON files: `changelog.json`, `actions.json`, `settings.json`, `factory_settings.json`, `factory_layout.json`, `starter_chords.json`, `functional_chords.json`. Also `arpeggiates.json`, `recipes.json` and `riley_chords.json` in some builds.',
            '- Firmware binaries: `firmware.bin`, `CURRENT.UF2`, and for esptool devices `tinyuf2.bin`, `bootloader-tinyuf2.bin`, `partitions.bin`, `boot_app0.bin`.',
            '- zero_linux: `libccos.so`. zero_wasm: `ccos.js`, `ccos.wasm`. zero_win: `libccos.dll`.',
            '',
            'Note: `riley_chords.json` is large (about 350 KB). Swagger UI may fail to render its response in Try it out.',
          ].join('\n'),
          parameters: [
            {
              name: 'device',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'version',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
            {
              name: 'file',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              examples: Object.fromEntries(
                FILE_EXAMPLES.map((file) => [file, { value: file }])
              ),
            },
          ],
          responses: {
            200: {
              description:
                'Content of the file. JSON for `.json` files, JavaScript for `ccos.js`, binary for the others.',
            },
          },
        },
      },
    },
  };
  return <SwaggerUI spec={spec} />;
}

export default SwaggerPage;
