import { ActionInfo, KeymapCategory } from './keymap.model';

export interface ActionInfoRowData extends Partial<ActionInfo> {
  rowType: 'action-info';
  actionCode?: number;
}

export interface KeymapCategoryRowData extends KeymapCategory {
  rowType: 'keymap-category';
}

export type ActionTableRowData = ActionInfoRowData | KeymapCategoryRowData;
