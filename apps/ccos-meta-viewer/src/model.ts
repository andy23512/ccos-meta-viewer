export interface Device {
  name: string;
  type: string;
  mtime: string;
}

export interface Version {
  name: string;
  type: string;
  mtime: string;
}

// Reference: https://github.com/CharaChorder/DeviceManager/blob/d84495894aadd821c3356966f834593fda96dcab/src/lib/meta/types/meta.ts
export interface Meta {
  version: string;
  target: string;
  git_commit: string;
  git_is_dirty: boolean;
  git_date: string;
  public_build: boolean;
  development_mode: number;
  actions: string;
  settings: string;
  changelog: string;
  factory_defaults: {
    layout: string;
    settings: string;
    chords: Record<string, string>;
  };
  update: {
    ota: string | null;
    uf2: string | null;
    esptool: EspToolData | null;
    js: string | null;
    wasm: string | null;
    dll: string | null;
    so: string | null;
  };
  files: string[];
  spi_flash: SPIFlashInfo | null;
}

export interface SPIFlashInfo {
  type: string;
  size: string;
  connection: SPIConnection;
}

export interface SPIConnection {
  clk: number;
  q: number;
  d: number;
  hd: number;
  cs: number;
}

export interface EspToolData {
  chip: string;
  baud: string;
  before: string;
  after: string;
  flash_mode: string;
  flash_freq: string;
  flash_size: string;
  files: Record<string, string>;
}
