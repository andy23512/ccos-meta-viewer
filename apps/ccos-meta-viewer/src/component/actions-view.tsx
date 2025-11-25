import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import {
  ColDef,
  colorSchemeDark,
  IsFullWidthRowParams,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionInfoRowData,
  ActionTableRowData,
} from '../model/action-table.model';
import { KeymapCategory } from '../model/keymap.model';
import categoryCellRenderer from './keymap-category-cell-renderer';

interface ActionsViewProps {
  value: KeymapCategory[];
}

type ActionsViewType = 'table' | 'json';

function ActionsView(props: ActionsViewProps) {
  const [viewType, setViewType] = useState<ActionsViewType>(
    () =>
      (localStorage.getItem('actionsViewType') as ActionsViewType) || 'table'
  );

  useEffect(() => {
    localStorage.setItem('actionsViewType', viewType);
  }, [viewType]);

  const handleViewTypeToggleChange = (
    _: MouseEvent<HTMLElement>,
    nextViewType: ActionsViewType
  ) => {
    setViewType(nextViewType);
  };

  const tableData: ActionTableRowData[] = props.value
    .map((category) =>
      (
        [{ rowType: 'keymap-category', ...category }] as ActionTableRowData[]
      ).concat(
        Object.entries(category.actions).map(
          ([actionCode, action]) =>
            ({
              rowType: 'action-info',
              ...action,
              actionCode: actionCode ? +actionCode : undefined,
            } satisfies ActionInfoRowData)
        ) as ActionTableRowData[]
      )
    )
    .flat();
  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'actionCode',
        cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
        pinned: 'left',
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'id',
        cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
        pinned: 'left',
        headerName: 'ID',
        filter: true,
      },
      {
        field: 'title',
        cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
        pinned: 'left',
        wrapText: true,
        filter: true,
      },
      {
        field: 'icon',
        wrapText: true,
        filter: true,
      },
      {
        field: 'display',
        filter: true,
      },
      {
        field: 'variant',
      },
      {
        field: 'variantOf',
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'keyCode',
        filter: true,
      },
      {
        field: 'printable',
        cellRenderer: 'agCheckboxCellRenderer',
        width: 100,
      },
      {
        field: 'separator',
        cellRenderer: 'agCheckboxCellRenderer',
        width: 100,
      },
      {
        field: 'breaking',
        cellRenderer: 'agCheckboxCellRenderer',
        width: 100,
      },
      {
        field: 'description',
        tooltipField: 'description',
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
    (params: IsFullWidthRowParams<ActionTableRowData>) =>
      params.rowNode.data?.rowType === 'keymap-category',
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
          fullWidthCellRenderer={categoryCellRenderer}
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

export default ActionsView;
