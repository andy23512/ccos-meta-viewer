import { OpenAPIV3_1 } from 'openapi-types';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export function App() {
  const spec: OpenAPIV3_1.Document = {
    openapi: '3.1.0',
    info: {
      title: 'CCOS Firmware meta API',
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
              description: 'A list of publicly available builds',
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
                            },
                          },
                        },
                      },
                      update: {
                        type: 'object',
                        properties: {
                          ota: { type: 'string' },
                          uf2: { type: 'string' },
                          esptool: {
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
                                properties: {
                                  '0x410000': { type: 'string' },
                                  '0x0000': { type: 'string' },
                                  '0x8000': { type: 'string' },
                                  '0xe000': { type: 'string' },
                                  '0x10000': { type: 'string' },
                                },
                              },
                            },
                          },
                        },
                      },
                      actions: { type: 'string' },
                      settings: { type: 'string' },
                      changelog: { type: 'string' },
                      files: { type: 'array', items: { type: 'string' } },
                      spi_flash: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          size: { type: 'string' },
                          spi_connection: {
                            type: 'object',
                            properties: {
                              clk: { type: 'number' },
                              q: { type: 'number' },
                              d: { type: 'number' },
                              hd: { type: 'number' },
                              cs: { type: 'number' },
                            },
                          },
                        },
                      },
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
            },
          ],
          responses: {
            200: {
              description: 'Content of the file',
            },
          },
        },
      },
    },
  };
  return <SwaggerUI spec={spec} />;
}

export default App;
