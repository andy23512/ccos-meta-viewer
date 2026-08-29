import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import {
  ColDef,
  colorSchemeDark,
  IsFullWidthRowParams,
  ITooltipParams,
  themeQuartz,
  ValueGetterParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  SettingItemRowData,
  SettingTableRowData,
} from '../model/setting-table.model';
import { Settings } from '../model/settings.model';
import sanitizedHtmlCellRenderer from './sanitized-html-cell-renderer';
import settingCategoryCellRenderer from './setting-category-cell-renderer';

interface SettingsViewProps {
  value: Settings;
}

type SettingsViewType = 'table' | 'json';

function SettingsView(props: SettingsViewProps) {
  const [viewType, setViewType] = useState<SettingsViewType>(
    () =>
      (localStorage.getItem('settingsViewType') as SettingsViewType) ||
      'table'
  );

  useEffect(() => {
    localStorage.setItem('settingsViewType', viewType);
  }, [viewType]);

  const handleViewTypeToggleChange = (
    _: MouseEvent<HTMLElement>,
    nextViewType: SettingsViewType
  ) => {
    if (nextViewType) {
      setViewType(nextViewType);
    }
  };

  const tableData: SettingTableRowData[] = props.value
    .map((category) =>
      (
        [
          { rowType: 'setting-category', ...category },
        ] as SettingTableRowData[]
      ).concat(
        category.items.map(
          (item) =>
            ({
              rowType: 'setting-item',
              ...item,
            } satisfies SettingItemRowData)
        )
      )
    )
    .flat();
  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
        pinned: 'left',
        filter: 'agNumberColumnFilter',
        width: 100,
      },
      {
        field: 'name',
        cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
        pinned: 'left',
        wrapText: true,
        filter: true,
      },
      {
        field: 'cmd',
        headerName: 'Command',
        filter: true,
      },
      {
        colId: 'range',
        headerName: 'Range',
        valueGetter: (params: ValueGetterParams<SettingTableRowData>) => {
          const range = (params.data as SettingItemRowData)?.range;
          return range ? `${range[0]} – ${range[1]}` : undefined;
        },
        filter: true,
      },
      {
        colId: 'enum',
        headerName: 'Enum',
        valueGetter: (params: ValueGetterParams<SettingTableRowData>) => {
          const enumValues = (params.data as SettingItemRowData)?.enum;
          return enumValues ? enumValues.join(', ') : undefined;
        },
        wrapText: true,
        filter: true,
      },
      {
        field: 'unit',
        width: 100,
      },
      {
        field: 'step',
        filter: 'agNumberColumnFilter',
        width: 100,
      },
      {
        field: 'scale',
        filter: 'agNumberColumnFilter',
        width: 100,
      },
      {
        field: 'description',
        cellRenderer: sanitizedHtmlCellRenderer,
        tooltipValueGetter: (
          params: ITooltipParams<SettingTableRowData>
        ) =>
          (params.data as SettingItemRowData)?.description?.replace(
            /<[^>]*>/g,
            ''
          ),
        width: 400,
        minWidth: 400,
        wrapText: true,
        filter: true,
      },
    ],
    []
  );
  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: false,
      suppressMovable: true,
      autoHeight: true,
    }),
    []
  );
  const isFullWidthRow = useCallback(
    (params: IsFullWidthRowParams<SettingTableRowData>) =>
      params.rowNode.data?.rowType === 'setting-category',
    []
  );
  const theme = themeQuartz.withPart(colorSchemeDark).withParams({
    headerBackgroundColor: 'rgba(59, 130, 246, 0.6)',
  });
  const autoSizeStrategy = useMemo(
    () => ({
      type: 'fitCellContents' as const,
    }),
    []
  );

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {viewType === 'table' ? (
        <AgGridReact
          theme={theme}
          rowData={tableData}
          columnDefs={colDefs}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={settingCategoryCellRenderer}
          autoSizeStrategy={autoSizeStrategy}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          defaultColDef={defaultColDef}
          tooltipShowMode="whenTruncated"
        ></AgGridReact>
      ) : (
        <JsonView
          className="h-full overflow-auto"
          value={props.value}
          style={vscodeTheme}
        ></JsonView>
      )}
      <ToggleButtonGroup
        sx={{ position: 'absolute', right: 14, bottom: '100%', mb: '16px' }}
        value={viewType}
        exclusive
        onChange={handleViewTypeToggleChange}
      >
        <ToggleButton value="table" aria-label="table">
          Table
        </ToggleButton>
        <ToggleButton value="json" aria-label="json">
          JSON
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default SettingsView;
