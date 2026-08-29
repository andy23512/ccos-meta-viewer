import { SettingCategory, SettingItem } from './settings.model';

export interface SettingItemRowData extends Partial<SettingItem> {
  rowType: 'setting-item';
}

export interface SettingCategoryRowData
  extends Omit<SettingCategory, 'items'> {
  rowType: 'setting-category';
}

export type SettingTableRowData = SettingItemRowData | SettingCategoryRowData;
