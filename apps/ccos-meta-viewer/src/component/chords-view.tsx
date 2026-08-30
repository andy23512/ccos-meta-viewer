import {
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import {
  CellStyleFunc,
  ColDef,
  colorSchemeDark,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { getMetaFile } from '../api';
import {
  buildActionLookup,
  convertChordFileToChords,
  convertChordToTcclParts,
  convertChordsToChordTreeNodes,
  flattenChordTreeNodes,
} from '../chord.util';
import { ChordFile } from '../model/chord.model';
import { KeymapCategory } from '../model/keymap.model';

interface ChordsViewProps {
  device: string;
  version: string;
  value: ChordFile;
}

type ChordsViewType = 'table' | 'json';

interface ChordRowData {
  level: number;
  input: string;
  output: string;
}

function ChordsView(props: ChordsViewProps) {
  const [viewType, setViewType] = useState<ChordsViewType>(
    () => (localStorage.getItem('chordsViewType') as ChordsViewType) || 'table'
  );

  useEffect(() => {
    localStorage.setItem('chordsViewType', viewType);
  }, [viewType]);

  const handleViewTypeToggleChange = (
    _: MouseEvent<HTMLElement>,
    nextViewType: ChordsViewType
  ) => {
    if (nextViewType) {
      setViewType(nextViewType);
    }
  };

  const actionsQuery = useQuery<KeymapCategory[]>({
    queryKey: [
      'devices',
      props.device,
      'versions',
      props.version,
      'meta',
      'actions.json',
    ],
    queryFn: async () =>
      (await getMetaFile(
        props.device,
        props.version,
        'actions.json'
      )) as unknown as KeymapCategory[],
  });

  const tableData: ChordRowData[] = useMemo(() => {
    if (!actionsQuery.data) {
      return [];
    }
    const actionLookup = buildActionLookup(actionsQuery.data);
    const chords = convertChordFileToChords(props.value);
    const tree = convertChordsToChordTreeNodes(chords);
    return flattenChordTreeNodes(tree).map((node) => ({
      level: node.level,
      ...convertChordToTcclParts(node, actionLookup),
    }));
  }, [actionsQuery.data, props.value]);

  const indentCellStyle: CellStyleFunc<ChordRowData> = (params) => ({
    paddingLeft: `${12 + (params.data?.level ?? 0) * 16}px`,
  });

  const colDefs: ColDef<ChordRowData>[] = useMemo(
    () => [
      {
        field: 'input',
        headerName: 'Input',
        cellStyle: indentCellStyle,
      },
      {
        field: 'output',
        headerName: 'Output',
      },
    ],
    []
  );
  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: false,
      suppressMovable: true,
      autoHeight: true,
      filter: true,
    }),
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
      {actionsQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      ) : viewType === 'table' ? (
        <AgGridReact
          theme={theme}
          rowData={tableData}
          columnDefs={colDefs}
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

export default ChordsView;
