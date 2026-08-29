export interface SettingItem {
  id: number;
  name: string;
  cmd?: string;
  description?: string;
  range?: [number, number];
  enum?: string[];
  unit?: string;
  step?: number;
  scale?: number;
}

export interface SettingCategory {
  name: string;
  cmd?: string;
  description?: string;
  items: SettingItem[];
}

export type Settings = SettingCategory[];
